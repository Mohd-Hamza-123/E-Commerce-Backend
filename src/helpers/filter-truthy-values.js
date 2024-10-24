"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTruthyValues = void 0;
const filterTruthyValues = (Obj) => {
    return Object.fromEntries(Object.entries(Obj).filter(([key, value]) => (value)));
};
exports.filterTruthyValues = filterTruthyValues;
