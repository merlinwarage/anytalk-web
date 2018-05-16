angular.module('uiMaskWrapperModule', ['ui.mask'])
.value('uiMaskConfig', {
        maskDefinitions: {
            '9': /\d/,
            'A': /[a-zA-Z]/,
            '*': /[a-zA-Z0-9]/
        },
        clearOnBlur: false,
        eventsToHandle: ['input', 'keyup']
    });