import ExampleFiles from './examples';
import Footer from './Footer';
import { useState } from 'react';

function HomePage() {
    
    // Função para codificar em Base64 seguro para URL
    function toUrlSafeBase64(str) {
      return btoa(str)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
    }

    const generate = (example) => {
        let data = toUrlSafeBase64(example);
        if (data !== "null" || data !== null) {
          window.open(`#/editor/${data}`, "_blank", "noreferrer");
        }
    };

    const [jsonFile, setJsonFile] = useState(null);

    // Função para tratar o upload do ficheiro JSON
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonContent = e.target.result;
                    const parsedJson = JSON.parse(jsonContent);
                    const base64Data = toUrlSafeBase64(JSON.stringify(parsedJson));
                    window.open(`#/escape_room/${base64Data}`, "_blank", "noreferrer");
                } catch (error) {
                    console.error("Erro ao processar o ficheiro JSON", error);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div>
          <h1>Home Page</h1>

          <h3>Example Boneco de Neve</h3>
          <button className="play-btn" id="" title="EDIT" onClick={() => generate(ExampleFiles.SNOWMAN)}>
                  <img src='/weberpl/logo.png'/>
                  <span>EDIT</span>
          </button>

          <br/><br/>

          <h3>Upload JSON para Escape Room</h3>
          <input 
              type="file" 
              accept="application/json"
              onChange={handleFileUpload}
          />

          <Footer/>
        </div>
    );
}

export { HomePage };
