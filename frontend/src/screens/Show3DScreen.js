import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Table, Image } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
//import FormContainer from '../components/FormContainer'
import { listMyOrders } from '../actions/orderActions'
import {LogThis} from '../libs/Logger'

import * as THREE from 'three'
import { LoadGLTFByPath } from '../libs/ModelHelper.js'
import {PointerLockControls} from 'three-stdlib'
//import {displayPaintingInfo, hidePaintingInfo} from './paintingInfo'

let controls = null
let playButton = null
let clock = null
let renderer = null
//Object to hold the keys pressed
const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
  e: false
}
const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    75, //field of view
    window.innerWidth / window.innerHeight, //Aspect Ratio in terms of the browswer window width and height.
    0.1, //near
    1000, //far
)

const findObjectByName = (parent, name) => {
  if (parent.name === name) {
      console.dir(`findObjectByName name found name=${parent.name}; uuid=${parent.uuid}`)
    return parent;
  } else {
    for (const child of parent.children) {
      console.dir(`findObjectByName exploring another child name=${child.name}; uuid=${child.uuid}`)
      const foundObject = findObjectByName(child, name);
      if (foundObject) {
        return foundObject;
      }
    }
  }
  return null;
};

const findObjectByNameInHierarchy = (parent, name) => {
  if (parent.name === name) {
    return parent;
  } else {
    for (const child of parent.children) {
      if (child instanceof THREE.Group) {
        const foundObject = findObjectByNameInHierarchy(child, name);
        if (foundObject) {
          return foundObject;
        }
      } else if (child.name === name) {
        return child;
      }
    }
  }
  return null;
};

const findObjectByUuid = (parent, uuid) => {
  if (parent.uuid === uuid) {
  console.log(`Found name=${parent.name}; uuid=${parent.uuid}`)
    return parent;
  } else {
    for (const child of parent.children) {
      console.log(`Another UUID child name=${child.name}; uuid=${child.uuid}`)
      const foundObject = findObjectByUuid(child, uuid);
      if (foundObject) {
        return foundObject;
      }
    }
  }
  return null;
};


function createPainting(imageUrl){
  const textureLoader = new THREE.TextureLoader()
  const paintingTexture = textureLoader.load(imageUrl)
  const paintingMaterial = new THREE.MeshBasicMaterial({
      map: paintingTexture,
      side: THREE.DoubleSide
  })
  //const paintingGeometry = new THREE.PlaneGeometry(width, height)
  //const painting = new THREE.Mesh(pFrame, paintingMaterial)
  //painting.position.set(position.x, position.y, position.z)
  return paintingMaterial
}


//Hide menu function
function hideMenu()
{
    const menu = document.getElementById("menu")
    menu.style.display = 'none'
}

//Show menu function
function showMenu()
{
    const menu = document.getElementById("menu")
    menu.style.display = 'block'
}


//Lock the pointer (controls are activated) and hide the menu when the experience starts
function startExperience(){
  //Lock the pointer
  controls.lock()
  //Hide the menu
  hideMenu()
}


function udpateMovement(delta){
    
  const moveSpeed = 5 * delta //moveSpeed is the distance the camera will move in one second. We multiply by delta to make the movement framerate independent. This means that the movement will be the same regardless of the framerate. This is important because if the framerate is low, the movement will be slow and if the frame rate is high, the movement will be fast. This is not what we want. We want the movement to be the same regardless of the framerate. 

  //const previousPosition =  camera.position.clone() //clone the camera position before the movement

  if(keysPressed.ArrowRight || keysPressed.d) {
      console.log(`updateMovement d`)
      controls.moveRight(moveSpeed)
  }
  if(keysPressed.ArrowLeft || keysPressed.a){
      console.log(`updateMovement a`)
      controls.moveRight(-moveSpeed)
  }
  if(keysPressed.w){
      console.log(`updateMovement w`)
      controls.moveForward(moveSpeed)
  }
  if(keysPressed.s){
      console.log(`updateMovement s`)
      controls.moveForward(-moveSpeed)
  }
  if(keysPressed.ArrowUp){
      console.log(`updateMovement w`)
      const currentPosition = controls.getObject().position;
      controls.getObject().position.set(currentPosition.x, currentPosition.y + moveSpeed, currentPosition.z);
  }
  if(keysPressed.ArrowDown){
      console.log(`updateMovement s`)
      const currentPosition = controls.getObject().position;
      controls.getObject().position.set(currentPosition.x, currentPosition.y - moveSpeed, currentPosition.z);
  }
  //After the movement is applied, we check for collisions by calling the checkCollision function. If a collision is detected, we revert the camera's position to its previous position, effectively preventing the player from moving through walls.
  // if(checkCollision()){
  //     camera.position.copy(previousPosition) //reset the camera position to the previous position. The `previousPosition` variable is a clone of the camera position before the movement. 
  // }
}

//We need a function for the animations
let render = function (){ 
  const delta = clock.getDelta() //get the time between frames
  udpateMovement(delta) //update the movement with the time between frames  
  renderer.render(scene, camera) //render the scene
  requestAnimationFrame(render) //requestAnimationFrame is a method that calls teh render function before the next repaint. This is used to render teh scene at 60 frames per second and is more efficient than using setInterval because it only renders when the browser is ready to repaint. 
}


const Show3DScreen = ({ location, history }) => {

  
  useEffect(() => {
    // Load the GLTF model
        LoadGLTFByPath(scene) 
        .then(() => {
          console.log(`Scene loaded`)
          //retrieveListOfCameras(scene);
          
          for (let i = 1; i<=11; i++) {
            const targetObject = `p${i}`; // Replace with the actual UUID
            
            const frameFound = findObjectByName(scene, targetObject);
            //const objectToPlaceOnTop = findObjectByNameInHierarchy(scene, targetObject);
            //console.log(`object found UUID: ${objectToPlaceOnTop.uuid}`)

          //   const targetObject = '064d7ff3-800e-4dcd-8d15-09b9d770e71f'; // Replace with the actual UUID
          //   const objectToPlaceOnTop = findObjectByUuid(scene, targetObject);
          
            if (frameFound) {
              console.log(`object found UUID: ${frameFound.uuid}`)
              
              frameFound.material = createPainting(
                `./img/${i}.jpg`,
                )
                frameFound.rotateY(Math.PI/2*-1)
            
              // scene.add(planeMesh);
            } else {
              //console.log(`Object "${targetObjectName}" not found in the model.`);
              console.log(`Object "${targetObject}" not found in the model.`);
            }
            
          }  
        
          
        })
        .catch((error) => {
          console.error('Error loading JSON scene:', error);
        });
        console.log(`Adding camera`)
        scene.add(camera)
        console.log(`Initial Scene: ${JSON.stringify(scene)}`)
        camera.position.z = 5
        camera.position.y = 1
        camera.position.x = 1
        //camera.rotateX(Math.PI/4)

        const targetObjectName = 'Cube.009'; // Adjust this to the name of the object you're looking for

        // Traverse the model's hierarchy to find the object by name



        //Renderer does the job of rendering the graphics
        renderer = new THREE.WebGLRenderer({
          antialias: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.setClearColor(0xffffff, 0);
        document.body.appendChild(renderer.domElement)

        //Controls for hiding the Virtual Museum Menu
        /**
        * The PointerLockControl is attached to the camera and the document.body of the HTML.
        */
        controls = new PointerLockControls(camera, document.body)
        playButton = document.getElementById("play_button")
        playButton.addEventListener("click", startExperience)
        controls.addEventListener('unlock', showMenu)

        // Event listener for when we press the keys.
        // The event is triggered only once when the user pressed. To keep the movement going we have to separate the keydown from keyup.
        document.addEventListener(
          'keydown', //`keydown` is an event that fires when a key is pressed
          (event) => {
              
              if(event.key in keysPressed){
                  console.log(`KeyDown ${event.key}`)
                  //check if the key pressed is in the keysPressed object
                  keysPressed[event.key] = true //if it is, set the value to true
              }
          }, 
          false
          )
        // Event listener for when we release the keys
        document.addEventListener(
          'keyup', //`keyup` is an event that fires when a key is released
          (event) => {
              if(event.key in keysPressed){
                  console.log(`KeyUp ${event.key}`)
                  //check if the key pressed is in the keysPressed object
                  keysPressed[event.key] = false //if it is, set the value to false
              }
          }, 
          false
          )
        clock = new THREE.Clock()
        render()
  }, [])

  useEffect(() => {
    
  }, [scene])






/*
Steps to make the objects move
1.- Move the object with position or rotation
2.- Render again the object.
3.- Repeat

The number of times you render per second, is the number of frames per second. Most monitors today have capacity of rendering 60 framesXsec or fps.
//To do this in Javascript we use Window.RequestAnimationFrame this tells the brownser that you want to perform an animation, look for documentation in google. 
requestAnimationFrame(render)
*/

  return (
    <div class="background_menu">
        <div id="menu">
            <div id="img_container">
                <Image src={"http://localhost:3000/img/starrynight.jpg"} alt={"newport bridge"}/>
            </div>
            <div id="content">
                <h1> 3D Art Gallery in 3D</h1>
                <div>
                    <p>This is an interactive 3D Gallery</p>
                    <p>Made with love and Three.js</p>
                </div>
                <div>
                    <p>Instructions</p>
                    <p>Arrow Keys</p>
                    <p>Look around with mouse</p>
                </div>

                <div id="play_button">
                    <p>Enter the Gallery</p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Show3DScreen
