import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scenePath = '/images/scene.json'

export const LoadGLTFByPath = (scene) => {
    return new Promise((resolve, reject) => {
      // Create a loader
      const loader = new GLTFLoader();
  
      // Load the GLTF file
      loader.load(scenePath, (gltf) => {
        console.log(`Loaded scene successfully`)
        scene.add(gltf.scene);

        resolve();
      }, undefined, (error) => {
        console.log(`Error Loading Scene`)
        reject(error);
      });
    });
};