import "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs-core";
import Human from "@vladmandic/human";
import * as nsfwjs from "nsfwjs";

const humanConfig = {
    modelBasePath: "https://cdn.jsdelivr.net/npm/@vladmandic/human/models/",
    face: { enabled: true },
    filter: { enabled: false },
};

export async function createDetector() {
    await tf.ready();
    const human = new Human(humanConfig);
    await human.load();
    const nsfwModel = await nsfwjs.load();
    return { human, nsfwModel };
}

export async function analyze(detector, imageTensor) {
    const faceRes = await detector.human.detect(imageTensor, "detect");
    const nsfwRes = await detector.nsfwModel.classify(imageTensor);
    return { faceRes, nsfwRes };
}
