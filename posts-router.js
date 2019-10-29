const router = require('express').Router();

const Posts = require('./data/db');

router.post('/', (req, res) => {
  const info = req.body;
  if (!info.title || !info.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  }
  Posts.insert(info)
    .then(post => {
      Posts.findById(post.id)
        .then(posts => {
          res.status(201).json(posts);
        })
        .catch(err => {
          res.status(500).json({
            error: 'There was an error while saving the post to the database'
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      });
    });
});

router.post('/:id/comments', (req, res) => {
  const id = req.params.id;
  const info = req.body;
  const comment = { text: info.text, post_id: id };

  if (!info.text) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide text for the comment.' });
  }
  Posts.findById(id)
    .then(post => {
      if (post == false) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      } else {
        Posts.insertComment(comment)
          .then(comments => {
            Posts.findCommentById(comments.id)
              .then(fullComment => {
                res.status(201).json(fullComment);
              })
              .catch(y => {
                res.status(500).json({
                  error: 'There was an error while retrieving the comment'
                });
              });
          })
          .catch(err => {
            res.status(500).json({
              error:
                'There was an error while saving the comment to the database'
            });
          });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'There was an error accessing the database' });
    });
});

router.get('/', (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved.' });
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then(post => {
      if (post == false) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' });
    });
});

router.get('/:id/comments', (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then(post => {
      if (post == false) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      } else {
        Posts.findPostComments(id)
          .then(comments => {
            res.status(200).json(comments);
          })
          .catch(err => {
            res.status(500).json({
              error: 'The comments information could not be retrieved.'
            });
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'There was an error retrieving the post.' });
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then(post => {
      if (post == false) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      } else {
        Posts.remove(id)
          .then(x => {
            res.status(200).json(post);
          })
          .catch(error => {
            res.status(500).json({ error: 'The post could not be removed' });
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'There was an error retrieving the post' });
    });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const info = req.body;

  if (!info.title || !info.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  }

  Posts.findById(id)
    .then(post => {
      if (post == false) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      } else {
        Posts.update(id, info)
          .then(x => {
            Posts.findById(id)
              .then(updatedPost => {
                res.status(200).json(updatedPost);
              })
              .catch(newError => {
                res
                  .status(500)
                  .json({ message: 'Could not return the updated post' });
              });
          })
          .catch(error => {
            res
              .status(500)
              .json({ error: 'The post information could not be modified.' });
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'There was an error retrieving the post' });
    });
});

module.exports = router;
