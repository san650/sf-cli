const util = require('util');
const exec = util.promisify(require('child_process').exec);
const logger = require('./logger');

module.exports = { deleteOrg, getInfo, showInfo, openOrg };

function deleteOrg(username) {
  const userParameter = username ? ` -u ${username}` : '';
  const command = `sfdx force:org:delete${userParameter}`;
  return exec(command);
}

async function showInfo(markdown) {
  const { username, password, instanceUrl, expirationDate } = await getInfo();
  if (markdown) {
    drawMarkdownTable(username, password, instanceUrl, expirationDate);
  } else {
    drawTable(username, password, instanceUrl, expirationDate);
  }
}

async function getInfo(user = null) {
  const userParameter = user ? ` -u ${user}` : '';
  const command = `sfdx force:org:display${userParameter} --json`;
  const { stderr, stdout } = await exec(command);

  if (stderr) {
    throw new Error(stderr);
  }

  const {
    result: { username, password, instanceUrl, expirationDate }
  } = JSON.parse(stdout);

  return { username, password, instanceUrl, expirationDate };
}

function openOrg(username) {
  const userParameter = username ? ` -u ${username}` : '';
  const openCommand = `sfdx force:org:open${userParameter}`;
  process.stdout.write('Opening browser...'); // write message and do not add a CRLF
  return exec(openCommand).then(() => process.stdout.write('\u{1B}[2K')); // remove line
}

function drawTable(username, password, instanceUrl, expirationDate) {
  logger.info('\u{1B}[34m%s: \u{1B}[0m    %s', 'Username', username);
  logger.info('\u{1B}[34m%s: \u{1B}[0m    %s', 'Password', password);
  logger.info('\u{1B}[34m%s: \u{1B}[0m%s', 'Instance Url', instanceUrl);
  logger.info('\u{1B}[34m%s: \u{1B}[0m  %s', 'Expiration', expirationDate);
}

function drawMarkdownTable(username, password, instanceUrl, expirationDate) {
  logger.info('|key          |value');
  logger.info('|:---         |:---');
  logger.info('|Username     |', username);
  logger.info('|Password     |', password);
  logger.info('|Instance Url |', instanceUrl);
  logger.info('|Expiration   |', expirationDate);
}