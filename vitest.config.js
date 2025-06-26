"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var path_1 = require("path");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.{test,spec}.ts'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'dist/'],
        },
    },
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src'),
        },
    },
});
