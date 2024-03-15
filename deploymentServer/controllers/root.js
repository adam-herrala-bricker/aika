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

  // need to prevent the env variables we give /deploymentServer
  // from injecting into the environment of the process itself
  const processVars = process.env;
  delete processVars.PORT;
  delete processVars.NODE_ENV;

  const deploy = spawn('bash',
    ['deploy_script.sh'],
    {
      shell: true, 
      detached: true, 
      env: {...processVars}
    }
  );

  deploy.stdout.on('data', (data) => {
    console.log(data.toString());
  })

  deploy.stderr.on('data', (data) => {
    console.log(data.toString());
  })

  res.status(200).send();
})

module.exports = router;
