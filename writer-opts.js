'use strict';

const compareFunc = require(`compare-func`);
const Q = require(`q`);
const readFile = Q.denodeify(require(`fs`).readFile);
const resolve = require(`path`).resolve;



const CONFIG_NAME = 'changelog.config.js';
const CONFIG_EXAMPLE_LOCATION = './changelog.config.EXAMPLE.js';
const findConfig = require('find-config');

function readConfigFile () {
  // First try to find the changelog.config.js config file
  const changelogConfig = findConfig.require(CONFIG_NAME, {home: false});
  if (changelogConfig) {
    return changelogConfig;
  } else{
    return false;
  }
}

module.exports = Q.all([
  readFile(resolve(__dirname, `./templates/template.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/header.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/commit.hbs`), `utf-8`),
  readFile(resolve(__dirname, `./templates/footer.hbs`), `utf-8`)
])
.spread((template, header, commit, footer) => {
  const writerOpts = getWriterOpts();

  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header;
  writerOpts.commitPartial = commit;
  writerOpts.footerPartial = footer;

  return writerOpts;
});

function getWriterOpts() {
  const config = readConfigFile();
  if (!config) {
    return;
  }
  return {
    transform: (commit, context) => {
      let discard = true;
      const issues = [];

      commit.notes.forEach(note => {
        note.title = `BREAKING CHANGES`;
        discard = false;
      });

      if (commit.type === `feat`) {
        commit.type = config['typeTitle'][commit.type] ||`Features`;
      } else if (commit.type === `fix`) {
        commit.type = config['typeTitle'][commit.type] || `Bug Fixes`;
      } else if (commit.type === `perf`) {
        commit.type = config['typeTitle'][commit.type] || `Performance Improvements`;
      } else if (commit.type === `revert`) {
        commit.type = config['typeTitle'][commit.type] || `Reverts`;
      } else if (discard) {
        return;
      } else if (commit.type === `docs`) {
        commit.type = config['typeTitle'][commit.type] || `Documentation`;
      } else if (commit.type === `style`) {
        commit.type = config['typeTitle'][commit.type] || `Styles`;
      } else if (commit.type === `refactor`) {
        commit.type = config['typeTitle'][commit.type] || `Code Refactoring`;
      } else if (commit.type === `test`) {
        commit.type = config['typeTitle'][commit.type] || `Tests`;
      } else if (commit.type === `chore`) {
        commit.type = config['typeTitle'][commit.type] || `Chores`;
      }

      if (commit.scope === `*`) {
        commit.scope = ``;
      }

      if (typeof commit.hash === `string`) {
        const hashLength = config.commitHashLength || 7;
        commit.hash = commit.hash.substring(0, hashLength);
      }

      if (config.link) {
        const { host, owner, repository } = config.link;
        context.host = host ||  context.host;
        context.owner = owner || context.owner;
        context.repository = repository || context.repository;
      }

      if (typeof commit.subject === `string`) {
        let url = context.repository ?
          `${context.host}/${context.owner}/${context.repository}` :
          context.repoUrl;
        if (url) {
          url = `${url}/issues/`;
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue);
            return `[#${issue}](${url}${issue})`;
          });
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9]){0,38})/g, `[@$1](${context.host}/$1)`);
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.issue) === -1) {
          return true;
        }

        return false;
      });
      return commit;
    },
    groupBy: `type`,
    commitGroupsSort: `title`,
    commitsSort: [`scope`, `subject`],
    noteGroupsSort: `title`,
    notesSort: compareFunc
  };
}
