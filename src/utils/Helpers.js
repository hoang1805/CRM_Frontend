const helpers = {
    encodeBase64(object) {
        const str = JSON.stringify(object);
        return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
    },

    decodeBase64(encoded) {
        const bytes = new Uint8Array([...atob(encoded)].map(c => c.charCodeAt(0)));
        return JSON.parse(new TextDecoder().decode(bytes));
    }
}

export default helpers;