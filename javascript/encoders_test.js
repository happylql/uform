import { existsSync } from 'fs';

import { getCheckpoint, Modality } from "./hub.mjs";
import { TextProcessor, TextEncoder } from "./encoders.mjs";

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

async function testGetCheckpoint() {
    console.log("Test getCheckpoint: Start");

    try {
        const modelId = 'unum-cloud/uform3-image-text-english-small';
        const token = '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';
        const modalities = [Modality.TextEncoder, Modality.ImageEncoder];

        const { configPath, modalityPaths, tokenizerPath } = await getCheckpoint(
            modelId,
            modalities,
            token,
            '.onnx'
        );

        assert(configPath !== null, "Config path should not be null");
        assert(modalityPaths !== null, "Modality paths should not be null");
        assert(tokenizerPath !== null, "Tokenizer path should not be null");

        // Check if the file actually exists
        assert(existsSync(configPath), `Config file should exist at ${configPath}`);
        assert(existsSync(tokenizerPath), `Tokenizer file should exist at ${tokenizerPath}`);
        for (const modalityPath of Object.values(modalityPaths)) {
            assert(existsSync(modalityPath), `Modality file should exist at ${modalityPath}`);
        }

        console.log("Test getCheckpoint: Success");
    } catch (error) {
        console.error("Test getCheckpoint: Failed", error);
    }
}

async function testTextEncoder() {
    console.log("Test TextEncoder: Start");

    try {
        const modelId = 'unum-cloud/uform3-image-text-english-small';
        const token = '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';
        const modalities = [Modality.TextEncoder, Modality.ImageEncoder];

        const { configPath, modalityPaths, tokenizerPath } = await getCheckpoint(
            modelId,
            modalities,
            token,
            '.onnx'
        );

        assert(configPath !== null, "Config path should not be null");
        assert(modalityPaths !== null, "Modality paths should not be null");
        assert(tokenizerPath !== null, "Tokenizer path should not be null");

        const textProcessor = new TextProcessor(configPath, tokenizerPath);
        await textProcessor.init();
        const processedTexts = await textProcessor.process("Hello, world!");
        console.log(processedTexts);

        const textEncoder = new TextEncoder(configPath, modalityPaths.text_encoder, tokenizerPath);
        await textEncoder.init();
        const output = await textEncoder.forward(processedTexts);
        console.log(output);

        console.log("Test getCheckpoint: Success");
    } catch (error) {
        console.error("Test getCheckpoint: Failed", error);
    }
}

testGetCheckpoint();
testTextEncoder();
