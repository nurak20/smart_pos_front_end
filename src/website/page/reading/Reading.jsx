import React, { useState } from 'react'
import { Page,Document } from 'react-pdf'
const Reading = () => {
    const pdfUrl = '/Users/nurak/Documents/ProjdectEcommerce/ecommerce/src/assets/my.pdf'
    const [url , setUrl] = useState(pdfUrl);
  return (
    <>
        <h1>PDF Viewer</h1>
      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>
    </>
  )
}

export default Reading
