export function speechRecognition(onResult?: (res: any) => void) {
    try {
        // @ts-ignore
        const voice = window.webkitSpeechRecognition || window.SpeechRecognition;
        const newVoice = voice ? new voice() : null;
      
        if(!newVoice) return;
      
        newVoice.lang = 'pt-BR';
        newVoice.onerror = (err: Error) => {
            console.log('error', err);
        };
        newVoice.onresult = onResult;
      
        return newVoice;
    } catch (error) {
        throw error;
    }
};