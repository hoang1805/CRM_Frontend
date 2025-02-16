const Arr = {
    findById(array, id) {
        if (!Array.isArray(array)) {
            return null;
        }

        return array.find(item => item.id === id);
    },
    find(array, fn) {
        if (!Array.isArray(array)) {
            return null;
        }

        if (typeof fn !== 'function') {
            return null;
        }

        return array.find(fn);
    }
};

export default Arr;