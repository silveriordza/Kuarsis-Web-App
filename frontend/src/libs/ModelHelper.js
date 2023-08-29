import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  KUARSIS_PUBLIC_STATIC_FOLDER,
} from '../constants/enviromentConstants'

const scenePath = './images/scene.gltf'

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