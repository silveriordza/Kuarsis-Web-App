export const convert = ({ file, width, height, type, watermarkText }) => {
  console.log(3)
  return new Promise((resolve, reject) => {
    let allow = ['jpg', 'gif', 'bmp', 'png', 'jpeg', 'svg']
    try {
      if (
        file.name &&
        file.name.split('.').reverse()[0] &&
        allow.includes(file.name.split('.').reverse()[0].toLowerCase()) &&
        file.size &&
        file.type
      ) {
        let imageType = type ? type : 'jpeg'
        const imgWidth = width ? width : 500
        const imgHeight = height ? height : 300
        const fileName = file.name

        const img = new Image()
        img.onload = () => {
          const elem = document.createElement('canvas')
          elem.width = imgWidth
          elem.height = imgHeight
          const ctx = elem.getContext('2d')
          ctx.drawImage(img, 0, 0, imgWidth, imgHeight)
          console.log(5)
          ctx.font = 'bold 10px Arial'
          ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
          ctx.fillText(watermarkText, imgWidth * 0.05, imgHeight * 0.05)
          ctx.fillText(watermarkText, imgWidth * 0.6, imgHeight * 0.05)
          ctx.fillText(watermarkText, imgWidth * 0.3, imgHeight * 0.5)
          ctx.fillText(watermarkText, imgWidth * 0.05, imgHeight * 0.9)
          ctx.fillText(watermarkText, imgWidth * 0.6, imgHeight * 0.9)
          ctx.canvas.toBlob(
            (blob) => {
              const newFile = new File([blob], fileName, {
                type: `image/${imageType.toLowerCase()}`,
                lastModified: Date.now(),
              })
              resolve(newFile)
            },
            'image/jpeg',
            1
          )
        }
        img.src = URL.createObjectURL(file)
      } else {
        reject('File not supported!')
      }
    } catch (error) {
      reject(error)
    }
  })
}
