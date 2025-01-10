// GENAI Citation: Used for JSON data formatting, selection, error checks.

import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const {
        codeTemplateId,
        input: requestInput,
        code: requestCode,
        language: requestLanguage,
    } = req.body;

    let code, input, language, fileExtension;

    try {
        if (codeTemplateId) {
            const codeTemplate = await prisma.codeTemplate.findUnique({
                where: { id: parseInt(codeTemplateId) },
            });

            if (!codeTemplate) {
                return res.status(404).json({ error: "Code template not found" });
            }

            language = codeTemplate.language;
            if (!language) {
                return res
                    .status(404)
                    .json({ error: "Language not found in code template" });
            }

            code = codeTemplate.content;
            input = codeTemplate.input || "";
        } else {
            if (!requestCode || !requestLanguage) {
                return res.status(400).json({
                    error:
                        "Code and language are required when codeTemplateId is not provided",
                });
            }

            code = requestCode;
            language = requestLanguage;
            input = requestInput || "";
        }

        const tempId = `TMP_${Date.now()}`;

        const extensions = {
            c: ".c",
            cpp: ".cpp",
            java: ".java",
            kotlin: ".kt"
        };
        fileExtension = extensions[language.toLowerCase()] || ".txt";

        const codeFileName =
            language.toLowerCase() === "java"
                ? "Main.java"
                : `${tempId}${fileExtension}`;

        const codeFile = path.join("/tmp", codeFileName);
        const inputFile = path.join("/tmp", `${tempId}_input.txt`);

        fs.writeFileSync(codeFile, code);
        fs.writeFileSync(inputFile, input);

        try {
            const { stdout, stderr } = await runCodeInDocker(
                language,
                codeFile,
                inputFile,
                fileExtension
            );

            res.status(200).json({
                success: true,
                output: stdout || "",
                error: stderr || "",
            });
        } catch (error) {
            res.status(200).json({
                success: false,
                output: error.stdout || "",
                error:
                    error.stderr ||
                    error.message ||
                    "An error occurred during code execution.",
            });
        } finally {
            try {
                fs.unlinkSync(codeFile);
                fs.unlinkSync(inputFile);
            } catch (cleanupError) {
                console.error("Error during cleanup:", cleanupError.message);
            }
        }
    } catch (error) {
        console.error("Error processing request:", error);
        res
            .status(500)
            .json({ error: "An error occurred while processing your request." });
    }
}

async function runCodeInDocker(language, codeFile, inputFile, fileExtension) {
    const languageImages = {
        python: "code-executor-python",
        javascript: "code-executor-javascript",
        java: "code-executor-java",
        c: "code-executor-c",
        cpp: "code-executor-cpp",
        go: "code-executor-go",
        ruby: "code-executor-ruby",
        php: "code-executor-php",
        typescript: "code-executor-typescript",
        rust: "code-executor-rust",
        swift: "code-executor-swift",
        kotlin: "code-executor-kotlin",
    };

    const image = languageImages[language.toLowerCase()];
    if (!image) {
        throw new Error("Unsupported language");
    }

    const options = { timeout: 10000 };

    const isJava = language.toLowerCase() === 'java';
    const isRuby = language.toLowerCase() === 'ruby';
    const isGo = language.toLowerCase() === 'go';
    const isKotlin = language.toLowerCase() === 'kotlin';

    const scriptFile = isJava
        ? '/sandbox/Main.java'
        : isRuby
            ? '/sandbox/script.rb'
            : isGo
                ? '/sandbox/script.go'
                : isKotlin
                    ? '/sandbox/script.kt'
                    : `/sandbox/script${fileExtension}`;

    let commandToRun;

    if (isJava) {
        commandToRun = 'javac /sandbox/Main.java && java -classpath /sandbox Main';
    } else if (isRuby) {
        commandToRun = 'ruby /sandbox/script.rb';
    } else if (isGo) {
        commandToRun = `
            cd /sandbox && 
            [ -f go.mod ] || go mod init sandbox && 
            go mod tidy && 
            go run script.go
        `;
    } else {
        switch (language.toLowerCase()) {
            case 'python':
                commandToRun = 'python3 /sandbox/script.txt';
                break;
            case 'javascript':
                commandToRun = 'node /sandbox/script.txt';
                break;
            case 'c':
                commandToRun = `gcc ${scriptFile} -o /sandbox/script && /sandbox/script`;
                break;
            case 'cpp':
                commandToRun = `g++ ${scriptFile} -o /sandbox/script && /sandbox/script`;
                break;
            case 'php':
                commandToRun = 'php /sandbox/script.txt';
                break;
            case 'typescript':
                commandToRun = 'ts-node /sandbox/script.txt';
                break;
            case 'rust':
                commandToRun = `rustc ${scriptFile} -o /sandbox/script && /sandbox/script`;
                break;
            case 'swift':
                commandToRun = 'swift /sandbox/script.txt';
                break;
            case 'kotlin':
                commandToRun = 'kotlinc /sandbox/script.txt -include-runtime -d /sandbox/script.jar && java -jar /sandbox/script.jar';
                break;
            default:
                throw new Error(`Unsupported language: ${language}`);
        }
    }

    const command = `docker run --rm -v /tmp/sandbox-go:/sandbox -v ${codeFile}:${scriptFile} -v ${inputFile}:/sandbox/input.txt ${image} sh -c "${commandToRun}"`;

    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject({ stdout, stderr, message: `${language} execution error: ${stderr}` });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

