import ExampleFiles from './examples';
import Footer from './Footer';
import { useState } from 'react';

// Função para codificar em Base64 seguro para URL
function toUrlSafeBase64(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function HomePage() {


  
      const generate = (example) => {
          let data = toUrlSafeBase64(example);
          if (data !== "null" || data !== null) {
            window.open(`#/editor/${data}`, "_blank", "noreferrer");
          }
      };

    // Função para gerar o link de jogo para um study-case específico
    const playStudyCase = (jsonPath) => {
        // Realiza fetch do arquivo JSON e, em seguida, codifica-o e abre o link
        fetch(jsonPath)
            .then(response => response.json())
            .then(jsonData => {
                const base64Data = toUrlSafeBase64(JSON.stringify(jsonData));
                window.open(`#/escape_room/${base64Data}`, "_blank", "noreferrer");
            })
            .catch(error => console.error("Erro ao carregar o study case JSON:", error));
    };

    // Simulação de study cases com paths relativos (substitui pelos caminhos corretos)
    const studyCases = [
        {
            title: "Study Case 1",
            image: '/weberpl/assets/study-cases/1.png', 
            json: '/weberpl/assets/study-cases/1.json'
        },
        {
            title: "Study Case 2",
            image: '/weberpl/assets/study-cases/2.png',
            json: '/weberpl/assets/study-cases/2.json'
        },
        {
            title: "Study Case 3",
            image: '/weberpl/assets/study-cases/3.png',
            json: '/weberpl/assets/study-cases/3.json'
        },
        {
            title: "Study Case 4",
            image: '/weberpl/assets/study-cases/4.png',
            json: '/weberpl/assets/study-cases/4.json'
        }
        
    ];

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
                <img src='/weberpl/logo.png' alt="Logo" />
                <span>EDIT</span>
            </button>

            <br/><br/>

            <h3>Upload JSON para Escape Room</h3>
            <input
                type="file"
                accept="application/json"
                onChange={handleFileUpload}
            />

            <br/><br/>

            <h3>Study Cases</h3>
            <div className="study-cases-container">
                {studyCases.map((studyCase, index) => (
                    <div key={index} className="study-case" onClick={() => playStudyCase(studyCase.json)}>
                        <img src={studyCase.image} alt={studyCase.title} className="study-case-img" />
                        <p>{studyCase.title}</p>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}

export { HomePage };
