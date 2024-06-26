const {unlink} = require('node:fs/promises');
const router = require('express').Router();
const multer = require('multer');
const {Op} = require('sequelize');
const {Slice, Strand, User} = require('../models');
const {slicePermissions, streamPermissions} = require('../util/middleware');
const {extensionBlobHelper, readFileData} = require('../util/helpers');

// for multer middleware
const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './temp/uploads/');
  },
  filename: (req, file, cb) => {
    file.originalname = extensionBlobHelper(file);
    cb(null, `${req.params.id}_${file.originalname}`);
  },
});

const uploadImage = multer({
  storage: storageImage,
  fileFilter: (req, file, cb) => {
    const permittedTypes = ['image/jpeg', 'image/png'];
    const fileType = file.mimetype;

    if (permittedTypes.includes(fileType)) {
      return cb(null, true);
    }

    return cb(new Error('file type not permitted')); // reject by default
  }
});

// POST request to view X slices in a stream, starting at Y (requires USER token)
router.post('/view/:id', streamPermissions, async (req, res) => {
  const defaultLimit = 10;
  const defaultOffset = 0;

  const streamId = req.params.id;
  const permissions = req.permissions;

  const thisLimit = req.body.limit || defaultLimit;
  const thisOffset = req.body.offset || defaultOffset;
  const thisSearch = req.body.search;
  const strandId = req.body.strandId;

  const ordering = strandId ? 'ASC' : 'DESC';

  if (!permissions.read) return res.status(403).json({error: 'read permission required'});

  // set up where based on whether there's a search
  let whereSearch = {};
  if (thisSearch && thisSearch.length > 0) {
    whereSearch = {
      [Op.or]: {
        title: {
          [Op.iLike]: `%${thisSearch}%`
        },
        text: {
          [Op.iLike]: `%${thisSearch}%`
        }
      }
    };
  }

  // filter just for a single strand if one is given
  let whereStrand = {};
  if (strandId) {
    whereStrand = {strandId: strandId};
  }

  const slices = await Slice.findAll({
    where: {
      streamId: streamId,
      ...whereSearch,
      ...whereStrand},
    include: [
      {
        model: User,
        attributes: ['username', 'id', 'firstName', 'lastName']
      },
      {
        model: Strand,
        attributes: ['id', 'name', 'createdAt', 'updatedAt']
      }
    ],
    attributes: {
      exclude: ['imageData'] // don't need it + clogs up Redux
    },
    limit: thisLimit,
    offset: thisOffset,
    order: [['createdAt', ordering]],
  });

  res.json(slices);

});

// POST request to create new slice
router.post('/:id',
  streamPermissions,
  uploadImage.single('image'),
  async (req, res) => {
    const creatorId = req.decodedToken.id;
    const streamId = req.params.id;
    const permissions = req.permissions;
    const {strandName} = req.body;

    if (!creatorId || !streamId) {
      return res.status(400).json({error: 'user and stream id must be provided'});
    }

    if (!permissions.write) {
      return res.status(403).json({error: 'user cannot write to this stream'});
    }

    // link to strand if provided (and not an empty string)
    if (strandName && strandName.length > 0) {
      // check to see if strand already exists
      const foundStrand = await Strand.findOne({
        where: {[Op.and]: { // strand names are unique for each stream
          name: strandName,
          streamId: streamId
        }}
      });
      if (foundStrand) {
        req.body.strandId = foundStrand.id;
      } else { // create new strand if none found
        const newStrand = await Strand.create({
          name: strandName,
          creatorId: creatorId,
          streamId: streamId
        });
        req.body.strandId = newStrand.id;
      }
    }

    const newEntry = await Slice.create({
      ...req.body,
      imageData: await readFileData(req.file?.path),
      imageName: req.file?.originalname,
      imageType: req.file?.mimetype,
      creatorId: creatorId,
      streamId: streamId,
    });

    // remove data from returned entry
    newEntry.imageData = null;

    if (req.file) {
      // delete temp file
      await unlink(`${req.file.path}`);
    }

    res.json(newEntry);
  });

// DELETE request to delete a slice
router.delete('/:id', slicePermissions, async (req, res) => {
  const entryId = req.params.id;
  const permissions = req.permissions;

  if (!permissions.canDelete) return res.status(403).json({error: 'user cannot delete this entry'});

  // remove from DB
  await Slice.destroy({where: {id: entryId}});

  res.status(204).end();
});

module.exports = router;
