import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import { createDetector, analyze } from "./detector";

export default function App() {
    const [image, setImage] = useState(null);
    const [blurred, setBlurred] = useState(false);
    const [detector, setDetector] = useState(null);

    useEffect(() => {
        (async () => {
            setDetector(await createDetector());
        })();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({});
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setBlurred(false);
        }
    };

    const runDetection = async () => {
        if (!detector || !image) return;
        const response = await fetch(image, {}, { isBinary: true });
        const buffer = await response.arrayBuffer();
        const tensor = decodeJpeg(new Uint8Array(buffer));
        const { faceRes, nsfwRes } = await analyze(detector, tensor);
        if (faceRes.face?.length || nsfwRes.some((c) => c.probability > 0.7)) {
            setBlurred(true);
        }
    };

    return (
        <View style={styles.container}>
            {image && (
                <Image
                    style={[styles.image, blurred && { opacity: 0.1 }]}
                    source={{ uri: image }}
                />
            )}
            <Button title="Pick image" onPress={pickImage} />
            <Button title="Analyze" onPress={runDetection} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    image: { width: 300, height: 300, marginBottom: 20 },
});
