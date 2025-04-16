export const tools = {
    async checkInternet() {
        try {
            const resp = await fetch('https://www.google.com', { method: 'HEAD',  });
            if (!resp.ok) throw 'Sem conexão com a internet.';
        } catch (error) {
            throw 'Sem conexão com a internet.';
        }
    }
}