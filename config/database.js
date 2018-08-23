if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI:
            //'mongodb://margarita:margo1984@ds255970.mlab.com:55970/ideas'
            'mongodb://localhost:27017/joinme'
    }
} else {
    module.exports = {
        mongoURI:
            'mongodb://localhost:27017/joinme'
    }
}