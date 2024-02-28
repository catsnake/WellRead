const axios = require('axios');

const wikipediaController = {};

wikipediaController.getArticleOfTheDay = async (req, res, next) => {
  try {
    const response = await axios.get('https://api.wikimedia.org/feed/v1/wikipedia/en/featured/2024/02/27');
    const article = response.data.tfa;
    const title = article.title;
    const description = article.extract;

    res.locals.articleOfTheDay = { title, description };

    return next();
  } catch (err) {
    return next({
      log: 'Error in wikipediaController',
      message: { error: 'Cannot fetch article of the day from Wikipedia' },
    });
  }
};

module.exports = wikipediaController;