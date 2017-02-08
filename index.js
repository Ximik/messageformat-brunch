'use strict';

const basename = require('path').basename,
      MessageFormat = require('messageformat');

class MessageFormatCompiler {
  constructor(config) {
    this.mfs = {};
    this.config = Object.assign({
      formatters: false,
      intl: false
    }, config.plugins.messageformat || {});
  }

  compile(file) {
    const { path, data } = file;
    let mf, lang = basename(path).split('.');

    lang = lang[lang.length - 3];
    if (this.mfs.hasOwnProperty(lang)) {
      mf = this.mfs[lang];
    } else {
      mf = this.mfs[lang] = new MessageFormat(lang);
      const { formatters, intl } = this.config;
      if (formatters) mf.addFormatters(formatters);
      if (intl) mf.setIntlSupport(intl);
    }

    return mf.compile(JSON.parse(data)).toString('module.exports');
  }
}

Object.assign(MessageFormatCompiler.prototype, {
  brunchPlugin: true,
  type: 'javascript',
  pattern: /[a-zA-Z]+\.lang\.json$/
});

module.exports = MessageFormatCompiler;
