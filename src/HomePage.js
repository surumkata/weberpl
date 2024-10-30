import Footer from './Footer';
import './HomePage.css'
import {useRef} from 'react';

// Função para codificar em Base64 seguro para URL
function toUrlSafeBase64(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function HomePage() {

    const inputFileJSON = useRef(null);
    const inputFileXML = useRef(null);

      // Função para gerar o link de jogo para um study-case específico em XML
      const edit = (xmlPath) => {
          // Realiza fetch do arquivo XML e, em seguida, codifica-o e abre o link
          fetch(xmlPath)
              .then(response => response.text()) // Obter o XML como texto
              .then(xmlText => {
                  // Parse do XML para um objeto
                  const parser = new DOMParser();
                  const xmlDoc = parser.parseFromString(xmlText, "application/xml");
              
                  // Verifica se o XML foi carregado corretamente
                  if (xmlDoc.querySelector("parsererror")) {
                      throw new Error("Erro ao interpretar o XML.");
                  }
              
                  // Converte o XML para uma string Base64 segura para URL
                  const base64Data = toUrlSafeBase64(new XMLSerializer().serializeToString(xmlDoc));
                  window.open(`#/editor/${base64Data}`, "_blank", "noreferrer");
              })
              .catch(error => console.error("Erro ao carregar o study case XML:", error));
      };

    // Função para gerar o link de jogo para um study-case específico
    const play = (jsonPath) => {
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
            title: "1. One Scenario and Multiple Objects",
            image: '/weberpl/assets/study-cases/1.png', 
            json: '/weberpl/assets/study-cases/1.json'
        },
        {
            title: "2. Multiple Scenarios and Transitions",
            image: '/weberpl/assets/study-cases/2.png',
            json: '/weberpl/assets/study-cases/2.json'
        },
        {
            title: "3. Challenges",
            image: '/weberpl/assets/study-cases/3.png',
            json: '/weberpl/assets/study-cases/3.json'
        },
        {
            title: "4. Time and variables",
            image: '/weberpl/assets/study-cases/4.png',
            json: '/weberpl/assets/study-cases/4.json'
        }
        
    ];

    const examples = [
        {
            title: "Snowman Sketch",
            image: '/weberpl/assets/examples/snowman.png',
            json: '/weberpl/assets/examples/snowman.json',
            xml: '/weberpl/assets/examples/snowman.xml',
        }
    ]
    
    const importJSON = () => {
        // `current` points to the mounted file input element
        inputFileJSON.current.click();
      };

    const importXML = () => {
      // `current` points to the mounted file input element
      inputFileXML.current.click();
    };

    // Função para tratar o upload do ficheiro JSON
    const handleFileUploadJSON = (event) => {
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

    // Função para tratar o upload do ficheiro XML
    const handleFileUploadXML = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const xmlContent = e.target.result;

                    // Converte o XML em um documento DOM
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

                    // Verifica se houve erro no parsing do XML
                    if (xmlDoc.querySelector("parsererror")) {
                        throw new Error("Erro ao interpretar o XML.");
                    }

                    // Serializa o XML de volta para string
                    const serializedXml = new XMLSerializer().serializeToString(xmlDoc);

                    // Codifica a string XML em Base64
                    const base64Data = toUrlSafeBase64(serializedXml);
                    window.open(`#/editor/${base64Data}`, "_blank", "noreferrer");
                } catch (error) {
                    console.error("Erro ao processar o ficheiro XML", error);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div>
            <div className="nav">
              <input type="checkbox" id="nav-check"/>
              <div className="nav-header"></div>
              <div className="nav-btn">
                <label htmlFor="nav-check">
                  <img src="/weberpl/logo.png"/>
                </label>
              </div>
              <div className="nav-links">
                <a className="a-img" href="/"><img src="/weberpl/logo_extenso.png" /></a>
                <a className="a-img" href="/"><img src="/weberpl/icons/edit.png" /></a>
                <div className="dropdown">
                  <button className="dropbtn">Import <i className="fa fa-caret-down"></i></button>
                  <div className="dropdown-content">
                    <a onClick={importJSON}>Import JSON</a>
                    <input type="file" accept="application/json" ref={inputFileJSON} onChange={handleFileUploadJSON} style={{display: 'none'}}/>
                    <a onClick={importXML}>Import XML</a>
                    <input type="file" accept="application/json" ref={inputFileXML} onChange={handleFileUploadXML} style={{display: 'none'}}/>
                  </div>
                </div> 

              </div>
            </div>
            
            <h1>Welcome to WEBERPL</h1>

            <h3>Study Cases</h3>
            <div className="study-cases-container">
                {studyCases.map((studyCase, index) => (
                    <div>
                        <img src={studyCase.image} alt={studyCase.title} className="study-case-img" />
                        <p>{studyCase.title}</p>
                        <button className="play-btn" id="" title="PLAY" onClick={() => play(examples[0].json)}>
                            <img src='/weberpl/logo.png' alt="Logo" />
                            <span>PLAY</span>
                        </button>
                    </div>
                ))}
            </div>

            <h3>Some Examples</h3>
            <div className="study-cases-container">
                {examples.map((example, index) => (
                    <div>
                        <img src={example.image} alt={example.title} className="study-case-img" />
                        <p>{example.title}</p>
                        <button className="play-btn" id="" title="EDIT" onClick={() => edit(example.xml)}>
                            <img src='/weberpl/icons/edit.png' alt="Logo" />
                            <span>EDIT</span>
                        </button>
                        <button className="play-btn" id="" title="PLAY" onClick={() => play(example.json)}>
                            <img src='/weberpl/logo.png' alt="Logo" />
                            <span>PLAY</span>
                        </button>
                    </div>
                ))}
            </div>
            
            <br></br>
            <br></br>
            <br></br>

            <Footer />
            </div>
    );
}

export { HomePage };
