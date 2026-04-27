


const handleFileUpload = async(file: File) => {
    setFile(file)
    setAnalyzing(true)
    setStatus("Uploading the file...")

    const uploadedFile = await fs.upload([file])
    if(!uploadedFile) return setStatus("Failed to upload file. Please try again.")

    // setStatus("Converting to image...")
    // // const imageFile = await convertPdfToImage(file)
    // if(!imageFile) return setStatus("Failed to convert PDF to image. Please try again.")

    // setStatus("Uploading the image...")
    // const uploadedImage = await fs.upload([imageFile])
    // if(!uploadedImage) return setStatus("Failed to upload image file. Please try again.")

    setStatus("Preparing Data...")
    const uuid = generateUUID()
    const data ={
      id:  uuid,
      filepath: uploadedFile.path,
      filename: file.name,
      filesize: file.size,
      filetype: file.type,
      feedback: ''
    }
    const kvResult = await kv.set(`file-${uuid}`, JSON.stringify(data))
    if(!kvResult) return setStatus("Failed to save file data. Please try again.")

    setStatus("Analyzing the document...")
    const feedback = await ai.feedback( 
      uploadedFile.path,
      prepareInstructions()
    )
    if(!feedback) return setStatus("Failed to analyze the document. Please try again.")

    const rawText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    // CLEAN and PARSE
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse AI JSON:", rawText);
      return setStatus("AI returned invalid format. Please try again.");
    }

    setStatus("Saving feedback...")
    data.feedback = parsed
    const feedbackResult = await kv.set(`file-${uuid}`, JSON.stringify(data))
    if(!feedbackResult) return setStatus("Failed to save feedback. Please try again.")

    setStatus("Analysis complete! Redirecting to results page...")

    console.log(parsed)
    setResults(parsed)

    
  }