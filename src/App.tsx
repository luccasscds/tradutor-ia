import { useState, useEffect } from 'react';
import { Container, Navbar, Button, Form, Spinner, Alert, Modal, ListGroup, Image } from 'react-bootstrap';
import './App.css'
import { IAController } from './controllers/IA.controller';
import * as appPackage from '../package.json';
import { languages } from './utils/languages';
import { speechRecognition } from './controllers/speechRecognition.controller';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(['en', 'es']);
  const [darkMode, setDarkMode] = useState(true);
  const [voiceRecognition, setVoiceRecognition] = useState(null as { start: () => void, stop: () => void, lang: string, addEventListener: any } | null);
  const [startMic, setStartMic] = useState(true);

  // Custom styles based on theme
  const themeStyles = {
    mainBackground: darkMode ? 'bg-dark' : 'bg-light',
    cardBackground: darkMode ? 'bg-dark text-white' : 'bg-white',
    textColor: darkMode ? 'text-light' : 'text-dark',
    borderColor: darkMode ? 'border-secondary' : 'border-light',
  };

  useEffect(() => {
    try {
      const titleElement = document.querySelector('head > title');
      if (titleElement) {
        // @ts-ignore
        titleElement.innerText = appPackage.name;
      };
  
      const newSpeehtRecognition = speechRecognition((res) => {
        const result = res.results[0][0].transcript;
        setInputText(result);
      });
      setVoiceRecognition(newSpeehtRecognition);
  
      document.body.classList.toggle('bg-dark', darkMode);
      return () => {
        document.body.classList.remove('bg-dark');
      };
    } catch (error) {
      setError(error as string);
    }
  }, [darkMode]);

  // Função para alternar um idioma na seleção
  function toggleLanguageSelection(code: string) {
    setSelectedLanguages(prev => {
      if (prev.includes(code)) {
        // Se já estiver selecionado e não for o último, remova-o
        return prev.length > 1 ? prev.filter(lang => lang !== code) : prev;
      } else {
        // Se não estiver selecionado, adicione-o
        return [...prev, code];
      }
    });
  };

  // Função para obter os idiomas selecionados como texto
  function getSelectedLanguagesText() {
    if (selectedLanguages.length === 1) {
      const lang = languages.find(l => l.code === selectedLanguages[0]);
      return lang?.name || '';
    } else {
      return `${selectedLanguages.length} idiomas selecionados`;
    }
  };
  
  async function executeTranslation() {
    try {
      if (!inputText.trim()) throw 'Por favor, digite algum texto para traduzir.';
      
      setIsLoading(true);
      setError('');
      
      // Obter os nomes dos idiomas selecionados
      const targetLanguages = selectedLanguages.map(code => {
        const lang = languages.find(l => l.code === code);
        return lang?.name || '';
      }).join(', ');
  
      const rersponse = await IAController.generateContent({
        contents: `
          Você é um assistente de IA que ajuda a traduzir textos.
          Traduza o seguinte texto para ${targetLanguages}.
          Retorne somente o texto traduzido, sem explicações ou formatações adicionais.
          Retorne da seguinte forma:
          
          * [idioma selecionado em português] 
          [Texto traduzido]
          
          
          """
          ${inputText}
          """
        `,
      });
  
      if (!rersponse) throw 'Resposta vazia.';
      setTranslatedText(rersponse);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className={`py-4 ${themeStyles.mainBackground}`} style={{ maxWidth: '550px' }}>
      <div className={`rounded shadow border ${themeStyles.cardBackground} ${themeStyles.borderColor}`}>
        {/* Navbar with settings and theme toggle buttons */}
        <Navbar bg={"primary"} variant="dark" className="rounded-top p-2">
          <Container>
            <Navbar.Brand className="fw-bold">
              <Image
                src="./assets/logo.png"
                alt="ícone do aplicativo"
                width={30}
                height={30}
                className="me-2"
              />
              {appPackage.name}
            </Navbar.Brand>
            <div className="d-flex gap-2">
              {/* Theme toggle button */}
              <Button 
                size="sm" 
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
              >
                {darkMode ? (
                  <Image
                    src="./assets/sol.svg"
                    alt="ícone do sol"
                    width={24}
                    height={24}
                  />
                ) : (
                  <Image
                    src="./assets/lua.svg"
                    alt="ícone da lua"
                    width={24}
                    height={24}
                  />
                )}
              </Button>

              {/* Settings button */}
              <Button 
                size="sm" 
                onClick={() => setShowSettings(true)}
                title="Configurações de idiomas"
              >
                <Image 
                  src="./assets/tradutor.svg"
                  alt="ícone de configurações de idiomas"
                  width={24}
                  height={24}
                />
              </Button>
            </div>
          </Container>
        </Navbar>
        
        <div className="p-4" style={{ minHeight: '520px' }}>
          <div className={`text-center ${darkMode ? 'text-light' : 'text-muted'} mb-3 small`}>
            Traduzindo de Português para {getSelectedLanguagesText()}
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

          {error && <Alert variant="danger" dismissible >Error: {error}</Alert>}

          <div className="d-flex gap-2 my-3 justify-content-center">
            <Button 
              variant={"primary"}
              className='flex-grow-1'
              onClick={executeTranslation}
              disabled={isLoading || !inputText.trim()}
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
            <Button
              variant="primary"
              disabled={!voiceRecognition}
              onMouseDown={() => {
                setStartMic(false);
                voiceRecognition?.start();
              }}
              onMouseUp={async () => {
                setStartMic(true);
                voiceRecognition?.stop();
              }}
            >
              {startMic ? (
                <Image
                src="./assets/mic.svg"
                alt="ícone do microfone"
                width={24}
                height={24}
              />)
                : (
                <Image
                src="./assets/mic-off.svg"
                alt="ícone do microfone"
                width={24}
                height={24}
              />)}
            </Button>
          </div>

          <Form.Group>
            <Form.Label className={`fw-medium ${themeStyles.textColor}`}>Tradução:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={translatedText}
              readOnly
            />
          </Form.Group>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)} className={darkMode ? 'dark-modal' : ''}>
        <Modal.Header className={darkMode ? 'bg-dark text-white' : ''}>
          <Modal.Title>Selecione os idiomas de tradução</Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? 'bg-dark' : ''}>
          <ListGroup variant={darkMode ? "dark" : ""}>
            {languages.map((lang) => (
              <ListGroup.Item 
                key={lang.code}
                action
                className={`d-flex align-items-center ${darkMode ? 'bg-dark text-white border-secondary' : ''}`}
                onClick={() => toggleLanguageSelection(lang.code)}
              >
                <Form.Check 
                  type="checkbox"
                  id={`checkbox-${lang.code}`}
                  checked={selectedLanguages.includes(lang.code)}
                  readOnly
                  label={
                    <div className="d-flex align-items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  }
                  className="w-100"
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default App;