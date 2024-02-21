const {unlink, writeFile} = require('node:fs/promises');
const router = require('express').Router();
const multer = require('multer');
const {Op} = require('sequelize');
const {Slice, User} = require('../models');
const {slicePermissions, streamPermissions} = require('../util/middleware');
const {readFileData} = require('../util/helpers');

// for multer middleware
const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './temp/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}_${file.originalname}`);
  },
});

const uploadImage = multer({storage: storageImage});


// GET request for all slices (will require ADMIN token)
router.get('/', async (req, res) => {
  const allSlices = await Slice.findAll({});

  res.json(allSlices);
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

  const slices = await Slice.findAll({
    where: {
      streamId: streamId,
      ...whereSearch},
    include: {
      model: User,
      attributes: ['username', 'id']
    },
    limit: thisLimit,
    offset: thisOffset,
    order: [['createdAt', 'DESC']],
  });

  // load temp media for slices with images
  for await (const slice of slices) {
    if (slice.imageData) {
      // one image per slice --> can safely id image by slice id + name
      await writeFile(`./temp/downloads/${slice.id}_${slice.imageName}`, slice.imageData, (error) => {
        if (error) {
          // error handling goes here
          console.log(error);
        }
      });
      // don't return image data to FE
      slice.imageData = null;
    }
  }

  res.json(slices);

});

// POST request to create new slice
router.post('/:id', streamPermissions, uploadImage.single('image'), async (req, res) => {
  const permittedFileTypes = ['image/jpeg', 'image/png'];
  const creatorId = req.decodedToken.id;
  const streamId = req.params.id;
  const permissions = req.permissions;

  if (!creatorId || !streamId) {
    return res.status(400).json({error: 'user and stream id must be provided'});
  }

  if (!permissions.write) {
    return res.status(403).json({error: 'user cannot write to this stream'});
  }

  if (req.file) {
    if (!permittedFileTypes.includes(req.file.mimetype)) {
      return res.status(400).json({error: 'file type not permitted'});
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
