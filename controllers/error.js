exports.get404 = (req, res, next) => {
    // res.send("404 error")
    res.status(404).render('error', { pageTitle: '404 - Page Not Found', path:'/404' });
}