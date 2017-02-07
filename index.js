'use strict';

const basename = require('path').basename,
      MessageFormat = require('messageformat');

class MessageformatCompiler {
  constructor(config) {
    this.mfs = {};
    this.config = config.plugins.messageformat || {};
    Object.assign(this.config, {
      formatters: {}
    });
  }

  compile(file) {
    const { path, data } = file;
    let mf, lang = basename(path).split('.');

    lang = lang[lang.length - 3];
    if (this.mfs.hasOwnProperty(lang)) {
      mf = this.mfs[lang];
    } else {
      mf = this.mfs[lang] = new MessageFormat(lang);
      mf.addFormatters(this.config.formatters);
    }

    return "module.exports =  (function () { " + mf.compile(JSON.parse(data)).toString() + " })();";
  }
}

Object.assign(MessageformatCompiler.prototype, {
  brunchPlugin: true,
  type: 'javascript',
  pattern: /[a-zA-Z]+\.lang\.json$/
});

module.exports = MessageformatCompiler;
