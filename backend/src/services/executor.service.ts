import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { languages } from "../config/languages.config.ts";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ExecutionResult {
  output?: string;
  error?: string;
  status?: string;
  expected_output?: string;
}

export const executeCode = async (
    language: string,
    code: string,
    input: string,
    expected_output: string
): Promise<ExecutionResult> => {
    return new Promise((resolve) => {
        const config = languages[language];

        if (!config) {
            return resolve({ error: "Unsupported language" });
        }

        const id = Date.now();
        const filename = `${id}.${config.extension}`;
        const submissionsPath = path.join(__dirname, "../submissions");
        const filePath = path.join(submissionsPath, filename);

        // Ensure submissions folder exists
        if (!fs.existsSync(submissionsPath)) {
            fs.mkdirSync(submissionsPath);
        }

        fs.writeFileSync(filePath, code);

        const dockerCommand = config.buildCommand
            ? `${config.buildCommand(filename)} && ${config.runCommand(filename)}`
            : config.runCommand(filename);

        const docker = spawn("docker", [
            "run",
            "--rm",
            "-i",
            "--memory=256m",
            "--cpus=0.5",
            "--pids-limit=50",
            "--network=none",
            "-v",
            `${submissionsPath}:/app`,
            config.image,
            "sh",
            "-c",
            dockerCommand.replaceAll(filename, `/app/${filename}`)
        ]);

        let output = "";
        let error = "";
        let status = "";

        if (input) {
            docker.stdin.write(input);
        }
        docker.stdin.end();

        docker.stdout.on("data", (data) => {
            output += data.toString();
            if(expected_output === output){
                status = "Accepted";
            } else {
                status = "Wrong Answer";
            }
        });

        docker.stderr.on("data", (data) => {
            error += data.toString();
        });

        docker.on("close", () => {
            fs.unlinkSync(filePath);
            resolve(error ? { error } : { output, expected_output, status });
        });  
    });
}
