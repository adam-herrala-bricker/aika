const router = require('express').Router();
const {exec, spawn} = require('node:child_process');

const {DEPLOY_KEY} = require('../util/config');

router.get('/:id', async (req, res) => {
  const providedKey = req.params.id;

  if (!providedKey) {
    return res.status(400).json({error: 'Deploy key required'});
  } else if (providedKey !== DEPLOY_KEY) {
    return res.status(400).json({error: 'Bad deploy key'});
  }

  const deploy = spawn('bash',
  ['deploy_script.sh'],
  // {shell: true, detached: true}
  
  );

  deploy.stdout.on('data', (data) => {
    console.log(data.toString());
  })

  deploy.stderr.on('data', (data) => {
    console.log(data.toString());
  })

  res.status(200).send();

  /*
  exec('bash deploy_script.sh', (err, stdout, stderr) => {
    // something has gone wrong
    if (err) {
      console.log(`exec error: ${err}`)
      return res.status(400).json({error: err});
    } else if (stderr) {
      console.log(`std error: ${stderr}`)
      return res.status(400).json({error: stderr});
    }
    console.log(stdout);
    res.status(200).send();
  })
  */
})

module.exports = router;
