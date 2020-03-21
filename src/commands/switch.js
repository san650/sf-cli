const { Command, flags } = require('@oclif/command');
const isSalesforceProject = require('../helpers/context-validation');
const openOrg = require('../helpers/open-scratch');
const listOrgs = require('../helpers/orgs-list');
const { setDefault } = require('../helpers/scratch-orgs');

class SwitchCommand extends Command {
  async run() {
    const { flags } = this.parse(SwitchCommand);
    const isProject = isSalesforceProject();

    if (!isProject) {
      this.log('This folder is not a salesforce solution, cannot switch the scratch orgs.');
      if (!flags.open) {
        return;
      }
    }

    return listOrgs('Choose Scratch Org:')
      .then(username => {
        if (!isProject) return username;
        return setDefault(username).then(() => username);
      })
      .then(username => flags.open && openOrg(username));
  }
}

SwitchCommand.description = 'Change the default scratch org';

SwitchCommand.flags = {
  open: flags.boolean({ char: 'o', description: 'Open the scratch org in the browser' })
};

module.exports = SwitchCommand;