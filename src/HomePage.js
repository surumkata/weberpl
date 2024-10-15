import ExampleFiles from './examples';
import Footer from './Footer';

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

    return (
        <div>
          <h1>Home Page</h1>

          <h3>Example Boneco de Neve</h3>
          <button className="play-btn" id="" title="PLAY" onClick={() => generate(ExampleFiles.SNOWMAN)}>
                  <img src='/weberpl/logo.png'/>
                  <span>EDIT</span>
          </button>
          <Footer/>
        </div>
    );
  }
  
export {HomePage};