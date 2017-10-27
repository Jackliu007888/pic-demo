module.exports = {
    "extends": "standard",
    'rules': {
        // allow paren-less arrow functions		
        'arrow-parens': 0,
        // allow async-await		
        'generator-star-spacing': 0,
        // allow debugger during development		
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'eol-last': 0,
        'camelcase': 0,
        'one-var': 0,
        'no-redeclare': 0,
        'new-cap': 0,
        'space-before-function-paren': 0
    }
};