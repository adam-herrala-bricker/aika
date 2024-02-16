const {readFile, writeFile} = require('node:fs/promises');
const router = require('express').Router();
const multer = require('multer');
const {Slice, User} = require('../models');
const {slicePermissions, streamPermissions} = require('../util/middleware');

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

  if (!permissions.read) return res.status(403).json({error: 'read permission required'});

  const slices = await Slice.findAll({
    where: {streamId: streamId},
    attributes: {
      // exclude: ['imageData']
    },
    include: {
      model: User,
      attributes: ['username', 'id']
    },
    limit: thisLimit,
    offset: thisOffset,
    order: [['createdAt', 'DESC']]
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
  const creatorId = req.decodedToken.id;
  const streamId = req.params.id;
  const permissions = req.permissions;

  if (!creatorId || !streamId) {
    return res.status(400).json({error: 'user and stream id must be provided'});
  }

  if(!permissions.write) {
    return res.status(403).json({error: 'user cannot write to this stream'});
  }

  const newEntry = await Slice.create({
    ...req.body,
    imageData: await readFile(`./${req.file.path}`, (error) => {
      if (error) {
        // error handling goes here
        console.log(error);
      }
    }),
    imageName: req.file.originalname,
    imageType: req.file.mimetype,
    creatorId: creatorId,
    streamId: streamId,
  });

  // remove data from returned entry
  newEntry.imageData = null;

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
