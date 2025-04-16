import { useState, useEffect } from 'react';
import { Container, Navbar, Button, Form, Spinner, Alert, Modal, ListGroup, Image } from 'react-bootstrap';
import './App.css'
import { IAController } from './controllers/IA.controller';
import * as appPackage from '../package.json';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    const titleElement = document.querySelector('head > title');
    if (titleElement) {
      // @ts-ignore
      titleElement.innerText = appPackage.name;
    };

    document.body.classList.toggle('bg-dark', darkMode);
    return () => {
      document.body.classList.remove('bg-dark');
    };
  }, [darkMode]);

  const languages = [
    { code: 'en', name: 'Inglês', flag: '🇬🇧' },
    { code: 'es', name: 'Espanhol', flag: '🇪🇸' },
    { code: 'fr', name: 'Francês', flag: '🇫🇷' },
    { code: 'de', name: 'Alemão', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ja', name: 'Japonês', flag: '🇯🇵' }
  ];

  async function simulateTranslation() {
    try {
      if (!inputText.trim()) {
        setError('Por favor, digite algum texto para traduzir.');
        return;
      }
  
      setIsLoading(true);
      setError('');
  
      const rersponse = await IAController.generateContent({
        contents: `
          Você é um assistente de IA que ajuda a traduzir textos.
          Traduza o seguinte texto para ${selectedLanguageObj?.name || languages[0].name}.
          Não adicione nada além do texto traduzido.
          
          """
          ${inputText}
          """
        `,
      });
  
      if (rersponse) {
        setTranslatedText(rersponse);
      } else {
        setError('Erro ao traduzir o texto. Tente novamente.');
      }
    } catch (error) {
      console.error('Error during translation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom styles based on theme
  const themeStyles = {
    mainBackground: darkMode ? 'bg-dark' : 'bg-light',
    cardBackground: darkMode ? 'bg-dark text-white' : 'bg-white',
    textColor: darkMode ? 'text-light' : 'text-dark',
    borderColor: darkMode ? 'border-secondary' : 'border-light',
  };

  const selectedLanguageObj = languages.find(l => l.code === selectedLanguage);

  return (
    <Container className={`py-4 ${themeStyles.mainBackground}`} style={{ maxWidth: '550px' }}>
      <div className={`rounded shadow border ${themeStyles.cardBackground} ${themeStyles.borderColor}`}>
        {/* Navbar with settings and theme toggle buttons */}
        <Navbar bg={"primary"} variant="dark" className="rounded-top p-2">
          <Container>
            <Navbar.Brand className="fw-bold">{appPackage.name}</Navbar.Brand>
            <div className="d-flex gap-2">
              {/* Theme toggle button */}
              <Button 
                variant={"light"} 
                size="sm" 
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
              >
                {darkMode ? (
                  <Image
                    src="/assets/sol.svg"
                    alt="ícone do sol"
                    width={24}
                    height={24}
                  />
                ) : (
                  <Image
                    src="/assets/lua.svg"
                    alt="ícone da lua"
                    width={24}
                    height={24}
                  />
                )}
              </Button>

              {/* Settings button */}
              <Button 
                variant="light" 
                size="sm" 
                onClick={() => setShowSettings(true)}
                title="Configurações"
              >
                <Image 
                  src="/assets/config.svg"
                  alt="Configurações"
                  width={24}
                  height={24}
                />
              </Button>
            </div>
          </Container>
        </Navbar>
        
        <div className="p-4" style={{ minHeight: '520px' }}>
          <div className={`text-center ${darkMode ? 'text-light' : 'text-muted'} mb-3 small`}>
            Traduzindo de Português para {selectedLanguageObj?.name}
          </div>
          
          <Form.Group className="mb-3">
            <Form.Label className={`fw-medium ${themeStyles.textColor}`}>Digite em Português:</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite o texto em português aqui..."
            />
          </Form.Group>

          {error && <Alert variant="danger" className="py-2 text-center">{error}</Alert>}

          <div className="d-grid gap-2 my-3">
            <Button 
              variant={"primary"} 
              onClick={simulateTranslation}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  <span>Traduzindo...</span>
                </>
              ) : 'Traduzir'}
            </Button>
          </div>

          <Form.Group>
            <Form.Label className={`fw-medium ${themeStyles.textColor}`}>Tradução:</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={translatedText}
              readOnly
            />
          </Form.Group>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)} className={darkMode ? 'dark-modal' : ''}>
        <Modal.Header className={darkMode ? 'bg-dark text-white' : ''}>
          <Modal.Title>Selecione o idioma</Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? 'bg-dark' : ''}>
          <ListGroup variant={darkMode ? "dark" : ""}>
            {languages.map((lang) => (
              <ListGroup.Item 
                key={lang.code}
                active={selectedLanguage === lang.code}
                action
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  setShowSettings(false);
                }}
                // @ts-ignore
                className={`d-flex align-items-center ${darkMode && !selectedLanguage === lang.code ? 'bg-dark text-white border-secondary' : ''}`}
              >
                <span className="me-3 fs-4">{lang.flag}</span>
                <span>{lang.name}</span>
                {selectedLanguage === lang.code && (
                  <Image
                    src="/assets/check.svg"
                    alt="ícone de verificação"
                    width={24}
                    height={24}
                    className="ms-auto"
                  />
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default App;