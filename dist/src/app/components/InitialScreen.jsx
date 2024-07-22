// src/pages/index.tsx
"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const router_1 = require("next/router");
const InitialScreen_module_css_1 = __importDefault(require("../styles/InitialScreen.module.css")); // 确保样式文件存在
const InitialScreen = () => {
    const router = (0, router_1.useRouter)();
    const generateSudoku = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch('/api/save-sudoku', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = yield response.json();
        router.push(`/game/${data.id}`);
    });
    return (<div className={InitialScreen_module_css_1.default.container}>
            <h1>Elysia的数独游戏</h1>
            <button onClick={generateSudoku}>出题</button>
        </div>);
};
exports.default = InitialScreen;
