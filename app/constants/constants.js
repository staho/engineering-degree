module.exports = {
  CATCH_ON_MAIN: 'catch-on-main',
  FUNCTIONS_DEF_LOAD: 'functions-def-load',
  LAST_FILE_NAME: 'lastFile.json',
  REQUEST_DATA_TO_SAVE: 'request-data-to-save',
  REQUEST_TEMPLATE_TO_SAVE: 'request-template-to-save',
  SEND_DATA_TO_SAVE: 'send-data-to-save',
  FILE_OPENED: 'file-opened',
  TEMPLATE_OPENED: 'template-opened',
  NOTEPAD_UNMOUNT: 'notepad-unmount',
  DELIMITER_CHANGE_SEND: 'delimiter-change-send',
  DELIMITER_CHANGE_RECEIVE: 'delimiter-change-receive',

  DELIMITERS: [
    {
      value: 'SPACE',
      realValue: ' ',
      label: 'Space'
    },
    {
      value: 'TAB',
      realValue: '\t',
      label: 'Tab'
    },
    {
      value: ';',
      realValue: ';',
      label: 'Semicolon'
    },
    {
      value: '(s+)',
      realValue: '(s+)',
      label: 'Whitespace',
      isRegExp: true
    }
  ]
};
