module.exports = (image) =>{
    const splitedName = image.name.split('.');
    const type = splitedName[splitedName.length - 1];
    const fileName = `${Date.now()}.${type}`

    return fileName;
}