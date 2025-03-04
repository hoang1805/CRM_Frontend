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
    },
    unique(array, fn) {
        if (!Array.isArray(array)) {
            return [];
        }
        
        if (typeof fn !== 'function') {
            return [...new Set(array)];
        }
        
        return [...new Set(array.filter(fn))];
    },
    uniqueById(array) {
        if (!Array.isArray(array)) {
            return [];
        }
        
        return [...new Set(array.map(item => item.id))].map(id => array.find(item => item.id === id));
    },
    sort(array, fn, order) {
        if (!Array.isArray(array)) {
            return [];
        }
        
        if (typeof fn !== 'function') {
            return [...array].sort((a, b) => order === 'asc'? a - b : b - a);
        }
        
        return [...array].sort((a, b) => order === 'asc'? fn(a) - fn(b) : fn(b) - fn(a));
    },
    update(array, value, fn) {
        if (!Array.isArray(array)) {
            return [];
        }
        
        if (typeof fn!== 'function') {
            return array.map(item => item === value ? {...item,...value} : item);
        }
        
        return array.map(item => fn(item) === fn(value)? {...item,...value} : item);
    },
    updateAll(array, fn) {
        if (!Array.isArray(array)) {
            return [];
        }
        
        if (typeof fn!== 'function') {
            return array;
        }
        
        return array.map(fn);
    }
};

export default Arr;