import axios from 'axios'
import fs from 'fs';
import React, { useState, useEffect } from 'react'
import csv from 'csv-parser' // Import the csv-parser library
// import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
// import { useDispatch, useSelector } from 'react-redux'
// import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import {
  BLANK_CONCAT_2NDROW_PREVIOUS_HEADER,
  CONCAT_1STROW_HEADER_2NDROW_HEADER,
  ROW_1ST_HAS_HEADERS,
  SECOND_ROW_HAS_HEADERS} from '../constants/surveyConstants'
  
import {surveysConfigurations} from '../surveysConfigurations'
// import { listProductDetails, updateProduct } from '../actions/productActions'
// import { PRODUCT_UPDATE_RESET, PRODUCT_DETAILS_SUCCESS } from '../constants/productConstants'
// import { BACKEND_ENDPOINT } from '../constants/enviromentConstants'
// import { convert } from '../libs/imagesLib'
// import { LogThis } from '../libs/Logger'


const UploadSurveyAnswers = ({ match, history }) => {
  //const productId = match.params.id

  // const [name, setName] = useState('')
  // const [price, setPrice] = useState(null)
  const [nombreDeArchivo, setnombreDeArchivo] = useState('')
  // const [brand, setBrand] = useState('')
  // const [isShippable, setisShippable] = useState(false)
  // const [isDownloadable, setisDownloadable] = useState(false)
  // const [isImageProtected, setisImageProtected] = useState(false)
  // const [isBookable, setisBookable] = useState(false)
  // const [category, setCategory] = useState('')
  // const [countInStock, setCountInStock] = useState(null)
  // const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  //const dispatch = useDispatch()

  // const productDetails = useSelector((state) => state.productDetails)
  // const { loading, error, product } = productDetails

  // LogThis(`UploadSurveyAnswers, product=${JSON.stringify(product)}`)

  // const productUpdate = useSelector((state) => state.productUpdate)

  // const {
  //   loading: loadingUpdate,
  //   error: errorUpdate,
  //   success: successUpdate,
  //   product: updatedProduct
  // } = productUpdate


  // LogThis(`UploadSurveyAnswers, updatedProduct=${JSON.stringify(updatedProduct)}`)
  // useEffect(() => {
  //   if (successUpdate) {
  //     dispatch({ type: PRODUCT_UPDATE_RESET })
  //     dispatch({
  //       type: PRODUCT_DETAILS_SUCCESS,
  //       payload: updatedProduct,
  //     })
  //     history.push('/admin/productlistadmin')
  //   } else {
  //     if (!product.name || product._id !== productId) {
  //       dispatch(listProductDetails(productId))
  //     } else {
  //       if (product.isCreated) {
  //         setName(product.name)
  //         setPrice(product.price)
  //         setImage(product.image)
  //         setBrand(product.brand)
  //         LogThis('UploadSurveyAnswers, useEffect, product =', product) 
  //         setisShippable(product.isShippable)
  //         setisDownloadable(product.isDownloadable)
  //         setisImageProtected(product.isImageProtected)
  //         setisBookable(product.isBookable)
  //         setCategory(product.category)
  //         setCountInStock(product.countInStock)
  //         setDescription(product.description)
  //       }
  //     }
  //   }
  // }, [dispatch, history, productId, product, updatedProduct, successUpdate])
  const rowCleaner = (rowToClean) => {
          let Row1Clean = rowToClean
        //   let startIndex = Row1Clean.indexOf('"')
        //   let endIndex = -1
        //   while(startIndex!=-1 && startIndex+1 < Row1Clean.length)
        //   {
        //   endIndex = Row1Clean.indexOf('"', startIndex+1)
        //   console.log(`startIndex=${startIndex}; endIndex=${endIndex}`)
        //   let before = Row1Clean.substring(0, startIndex)
        //   let after = Row1Clean.substring(endIndex + 1)
        //   let replacement = Row1Clean.substring(startIndex+1, endIndex)
        //   console.log(`replace=${replacement}`)
        //   replacement = replacement.replace(/,/g, ';')
        //   console.log(`replace2=${replacement}`)
        //   Row1Clean = before + replacement + after
        //   //console.log(Row1Clean)
        //   startIndex = Row1Clean.indexOf('"', endIndex+1)
        //  }
        const quoteChar1 = '”'
        const quoteChar2 = '“'
        const quoteChar3 = '"'
        console.log(`quoteChar1=${quoteChar1.charCodeAt(0)}; quoteChar2=${quoteChar2.charCodeAt(0)}; quoteChar3=${quoteChar3.charCodeAt(0)};`)
        let quotesCount = 0
        let semiColonChar = ";"
        const rowArray = Row1Clean.split('') 
        for (let i = 0; i < rowArray.length; i++)
        {
          if(rowArray[i]=='"'){
            if(quotesCount==0)
            {
              console.log(`opening quotes identified at column i=${i}`)
              quotesCount++
            } else {
              console.log(`closing quotes  identified at column i=${i}`)
              quotesCount--
            }
          } else{
            if(quotesCount>0 && rowArray[i]==','){
              console.log(`replacing comma at column i=${i}`)
              rowArray[i] = semiColonChar
              console.log(`replaced comma at column i=${i}`)
            }
          }
        }
         return rowArray.join('')
    }
        
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    setUploading(true)
    try {
// //OPTION 1 USING CSV-PARSER
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const fileContents = e.target.result;
          
//           // Use csv-parser to parse the CSV content
//           const results = [];
//           const parseStream = csv();
  
//           parseStream.on('data', (data) => {
//             results.push(data);
//           });
  
//           parseStream.on('end', () => {
//             console.log('Parsed CSV data:', results);
//           });
  
//           parseStream.write(fileContents);
//           parseStream.end();
//         };
  
//         reader.readAsText(file);
//       }
//       setUploading(false)

// //OPTION 2 PARSING FILE MANUALLY
// if(file){    
//     const results = [];

//         fs.readFile(file.name, 'utf8', (err, data) => {
//           if (err) {
//             console.error(err);
//             return;
//           }

//           // Split the CSV content into an array of rows
//           const rows = data.split('\n');
 
//           // Parse each row into an object (assuming the first row contains headers)
//           const headers = rows[0].split(',');
//           console.log(headers)
          
//           for (let i = 1; i < rows.length; i++) {
//             const rowData = rows[i].split(',');
//             const rowObject = {};

//             for (let j = 0; j < headers.length; j++) {
//               rowObject[headers[j]] = rowData[j];
//             }

//             results.push(rowObject);
//           }

//           console.log(results);
//         })
//       }

// //OPTION 3 USING FileReader only
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContents = e.target.result;
          
          let rows = fileContents.split('\n');
 
          // Parse each row into an object (assuming the first row contains headers)
          


          let Row1 = rows[0];
          let Row2 = rows[1];
          console.log(Row1)
          console.log(Row2)
          

          console.log("ROW 1 CLEANUP START")
          const headersRow1 = rowCleaner(Row1).split(',');
          console.log("ROW 1 CLEANUP END")
          console.log("ROW 2 CLEANUP START")
          const headersRow2 = rowCleaner(Row2).split(',');
          console.log("ROW 2 CLEANUP END")
          console.log(headersRow1)
          console.log(headersRow2)
          const finalHeaders = [];
 
          surveysConfigurations.forEach((survey) => {
            survey.subSurvey.forEach((subSurvey) => {
              subSurvey.headerParserModificators.forEach(hpm => {
                switch (hpm.modificator){
                  case BLANK_CONCAT_2NDROW_PREVIOUS_HEADER:
                    {
                      let currentValue = '';
                      let previousNonEmpty = ''
                    
                    for (let col = hpm.startColumn; col <= hpm.endColumn; col++) {
                      currentValue = headersRow1[col];
                      if(currentValue == '')
                      {

                        if(previousNonEmpty != ''){
                          let concatValue = previousNonEmpty + headersRow2[col]
                          finalHeaders.push(subSurvey.subSurveyName + '_' + concatValue)
                        } else {
                          for (let backCol = col-1; backCol>=0; col--)
                          {
                            let backColVal = headersRow1[backCol]
                            if(backColVal!='')
                            {
                              previousNonEmpty = backColVal
                              break
                            }
                          }
                          if(previousNonEmpty == ''){
                          throw new Error(`Header incorrect format on column: ${col}`)
                        }
                        }         
                      } else {
                        console.log(`previousNonEmpty = ${previousNonEmpty}`)
                        previousNonEmpty = headersRow1[col]
                        finalHeaders.push(subSurvey.subSurveyName + '_' + headersRow1[col])
                      }
                      
                    }
                  }
                    break
                  case SECOND_ROW_HAS_HEADERS:
                    for (let col = hpm.startColumn; col <= hpm.endColumn; col++) {
                      finalHeaders.push(subSurvey.subSurveyName + '_' + headersRow2[col])
                    }
                    break
                  case CONCAT_1STROW_HEADER_2NDROW_HEADER:
                  { 
                    let previousValue = ''
      
                    if (headersRow1[hpm.startColumn] == ''){
                      throw new Error(`Header incorrect format on column: ${hpm.startColumn}; headersRow1[hpm.startColumn]=${headersRow1[hpm.startColumn]}`)
                    } 
                    
                    for (let col = hpm.startColumn; col <= hpm.endColumn; col++) {
                      if (headersRow1[col] != '')
                      {
                        previousValue = headersRow1[col]
                      }
                     
                      finalHeaders.push(subSurvey.subSurveyName + '_' + previousValue + ' ' + headersRow2[col])
                    }
                  }
                    break
                  case ROW_1ST_HAS_HEADERS:
                    { 
                      for (let col = hpm.startColumn; col <= hpm.endColumn; col++) {
                        finalHeaders.push(subSurvey.subSurveyName + '_' + headersRow1[col])
                      }
                    }
                    break
                }
              })
            })
          })
          

          console.log(finalHeaders)
          const results = [];
          for (let i = 2; i < rows.length; i++) {
              const rowData = rows[i].split(',');
              const rowObject = {};
  
              for (let j = 0; j < finalHeaders.length; j++) {
                console.log(`results j=${j}; finalHeaders[j]=${finalHeaders[j]}; rowData[j]=${rowData[j]}`)
                
                rowObject[finalHeaders[j]] = rowData[j];
              }
              
              results.push(rowObject);
              console.log(`results`) 
              console.log(results)
            }

            console.log(`results are`)
            console.log(results)

        };
  
        reader.readAsText(file);
      }
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    // dispatch(
    //   updateProduct({
    //     _id: productId,
    //     name,
    //     price,
    //     image,
    //     brand,
    //     isShippable,
    //     isDownloadable,
    //     isImageProtected,
    //     isBookable,
    //     category,
    //     description,
    //     countInStock,
    //     isCreated: true,
    //   })
    // )
  }

return (
    <>
      {/* <Link to='/admin/productlistadmin' className='btn btn-light my-3'>
        Go Back
      </Link> */}
      <FormContainer>
        <h1>Subir archivo de respuestas de encuestas.</h1>
        {/* {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : ( */}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='nombreDeArchivo'>
              <Form.Label>Folder y nombre de archivo</Form.Label>
              <Form.Control
                type='text'
                placeholder='Seleccionar el archivo'
                value={nombreDeArchivo}
                onChange={(e) => setnombreDeArchivo(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                className=''
                onChange={uploadFileHandler}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>
            <br />
            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        {/* )} */}
      </FormContainer>
    </>
  )
}

export default UploadSurveyAnswers
