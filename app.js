const express = require('express');
const mongoose = require('mongoose');
const sharp = require('sharp');
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require ('path');
const Dorm = require('./models/dorm')
const Owner = require('./models/owner')
const passport = require ('passport')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
const session = require('express-session')
const { ensureAuthenticated } = require('./config/auth');

const multer = require('multer')

// Passport config
require('./config/passport')(passport);


//NIRAJ MULTER
const storage = multer.memoryStorage();
const uploads = multer({storage})


// const storage2 = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// })

// const upload = multer({storage2: storage2})


//init express app & middleware
const app = express();

//connect to mongodb atlas
const dbURI = "mongodb+srv://practice:ust@cluster0.l1xzlip.mongodb.net/acadorm?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true}, {useUnifiedTopology: true }, mongoose.set('strictQuery', true))
    .then((result) => {
        console.log('connected to db')

        //connect to application server
        app.listen(3000, () => {
            console.log('app listening on port 3000')
        })
    })
    .catch((err) => console.log(err)
);




// middleware & static files
app.use(express.static('public'))

// register view engine
app.set('view engine', 'ejs');

// bodyparser
app.use(bodyParser.urlencoded({ extended: false }));           
app.use(bodyParser.json()) 

// Express Session
app.use(session({
    secret: 'ust',
    resave: true,
    saveUninitialized: true,
}))


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    next();
})

//routes
app.get('/dorms', (req, res) => {
    //sample code
    Dorm.find({}, (err, items) => {
        if(err){
            console.log(err);
            res.status(500).send('An error occured retrieving items', err);
        }
        else {
            res.render('dorms', { items: items });
        }
    })

    // db.collection('dorms')
    //     .find() 
    //     .sort({dorm_id: 1})
    //     .forEach(dorm => 
    //         {
    //             dorms.push(dorm)
    //             dorms.at(-1).uniCounter = true;
    //             dorms.at(-1).priceCounter = true,
    //             dorms.at(-1).bedCounter = true,
    //             dorms.at(-1).sharingCounter = true
    //         })
    //     .then(() => {
    //         res.render('dorms');
    //         // res.sendFile('./views/dorms.html', { root: __dirname})
    //         // res.status(200).json(dorms)
    //     })
    //     .catch(() => {
    //         res.status(500).json({error: 'Could not fetch the documents'})
    //     })

    // res.json({mssg: "welcome to the app"})
})



app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/:id/add-dorm', (req, res) => {
    Owner.find({owner_id: req.params.id}, (err, items) => {
        if(err){
            console.log(err);
            res.status(500).send('An error occured retrieving items', err);
        }
        else {
            res.render('add-dorm', { items: items });
        }
    })
})


// for auto-incrementing dorm id
let maxDocumentId;
// Dorm.count({}, (err, count) => {
//     maxDocumentId = count;
// })

Dorm.findOne({}).sort('-dorm_id').exec(function (err, member) {
    maxDocumentId = member.dorm_id;
    
})

app.post('/:id/add-dorm', uploads.array('dorm_photos', 5), async (req, res) => {
    //increment ID
    maxDocumentId++;

    let dormImages = []
    
    await Promise.all(
        req.files.map(async file => {
          const newFilename = file.fieldname + '-' + Date.now();
    
          await sharp(file.buffer)
            .resize(839, 472)
            .toFile(`uploads/${newFilename}`)
            .then(() => {
                dormImages.push(fs.readFileSync(path.join(__dirname+ `/uploads/${newFilename}`)));
            })
            .catch((err) => {
                console.log(err)
            });
        })
    )
    .then(() => {
        console.log("success")
    }) 
    .catch((err) => {
        console.log(err)
    })

    const newDorm = new Dorm({
        dorm_id: maxDocumentId,
        owner_id: req.params.id,
        dorm_name: req.body.dorm_name,
        uni: req.body.uni,
        price: req.body.price,
        sharing: req.body.sharing,
        bedroom: req.body.bedroom,
        bath: req.body.bath,
        type: req.body.type,
        location: req.body.location,
        dorm_photos: {
            data: dormImages,
            contentType: "image/*"
        },
        description: req.body.description,
    })
    
    newDorm.save()

    .then(() => {
        console.log("succesfully stored dorm data")

        const directory = "uploads";
        fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
            });
        }
        });

        res.redirect('/dorm-info-owner/'+ newDorm.dorm_id)
    })
    .catch((err) => {
        console.log(err)
    })
    
})

app.get('/dorm-info-owner/:id', (req, res) => {
    Dorm.find({dorm_id: req.params.id}, (err, items) => {
        if(err){
            console.log(err);
            res.status(500).send('An error occured retrieving items', err);
        }
        else {
            res.render('dorm-info-owner', { items: items });
        }
    })
})

app.get('/dorm-info/:id', (req, res) => {
    Dorm.find({dorm_id: req.params.id}, (err, items) => {
        if(err){
            console.log(err);
            res.status(500).send('An error occured retrieving items', err);
        }
        else {
            res.render('dorm-info', { items: items });
        }
    })
})


app.get('/edit-dorm/:id',  (req, res) => {
    Dorm.find({dorm_id: req.params.id}, (err, items) => {
        if(err){
            console.log(err);
            res.status(500).send('An error occured retrieving items', err);
        }
        else {
            res.render('edit-dorm', { items: items });
        }
    })
})

app.post('/edit-dorm/:id', uploads.array('dorm_photos', 5), async (req, res) => {
    let dormImages = []
    
    
    // await Promise.all(
    //     req.files.map(async file => {
    //       const newFilename = file.fieldname + '-' + Date.now();
    
    //       await sharp(file.buffer)
    //         .resize(839, 472)
    //         .toFile(`uploads/${newFilename}`)
    //         .then(() => {
    //             dormImages.push(fs.readFileSync(path.join(__dirname+ `/uploads/${newFilename}`)));
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         });
    //     })
    // )
    // .then(() => {
    //     console.log("success")
    // }) 
    // .catch((err) => {
    //     console.log(err)
    // })

    Dorm.findOneAndUpdate({dorm_id: req.params.id}, {$set: {
        dorm_name: req.body.dorm_name,
        uni: req.body.uni,
        price: req.body.price,
        sharing: req.body.sharing,
        bedroom: req.body.bedroom,
        bath: req.body.bath,
        type: req.body.type,
        location: req.body.location,
        description: req.body.description,
    }}).then(() => {
        console.log("update successful")
        res.redirect('/dorm-info-owner/' + req.params.id)

    }).catch((err) => {
        console.log(err)
    })
})

app.get('/edit-dorm/delete/:id', (req, res) => {
    Dorm.findOneAndDelete({dorm_id: req.params.id}, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("delete success");
                res.redirect('/my-account/' + docs.owner_id)
            }
    })
})

app.get('/edit-profile/:id', (req, res) => {
    Owner.find({owner_id: req.params.id}, (err, items) => {
        if(err){
            console.log(err);
            res.status(500).send('An error occured retrieving items', err);
        }
        else {
            res.render('edit-profile', { items: items });
        }
    })
})

app.post('/edit-profile/:id', uploads.array('owner_photo', 5), async (req, res) => {
    let ownerImages = []
    
    await Promise.all(
        req.files.map(async file => {
          const newFilename = file.fieldname + '-' + Date.now();
    
          await sharp(file.buffer)
            .resize(296, 347)
            .toFile(`uploads/${newFilename}`)
            .then(() => {
                ownerImages.push(fs.readFileSync(path.join(__dirname+ `/uploads/${newFilename}`)));
            })
            .catch((err) => {
                console.log(err)
            });
        })
    )
    .then(() => {
        console.log("success")
    }) 
    .catch((err) => {
        console.log(err)
    })

    Owner.findOneAndUpdate({owner_id: req.params.id}, {$set: {
        email: req.body.email,
        owner_name: req.body.owner_name,
        phone: req.body.phone,
        facebook: req.body.facebook,
        viber: req.body.viber,
        prefer_comm: req.body.prefer_comm,
        owner_photo: {
            data: ownerImages,
            contentType: 'image/*'
        }
    }}).then(() => {
        console.log("update successful")

        const directory = "uploads";
        fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
            });
        }
        });

        res.redirect('/my-account/' + req.params.id)

    }).catch((err) => {
        console.log(err)
    })
})

app.get('/edit-profile/deletePhoto/:id',(req, res) => {
    Owner.findOneAndUpdate({owner_id: req.params.id}, {$set: {
        owner_photo: {
            data: [],
        }
    }}).then(() => {
        console.log("update successful")
        res.redirect('/edit-profile/' + req.params.id)
    }).catch((err) => {
        console.log(err)
    })
})


app.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
})

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/index', (req, res) => {
    res.render('index');
})

app.get('/log-in', (req, res) => {
    res.render('log-in');
})

app.post('/log-in', async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/log-in',
        failureFlash: true
    })(req, res, next);
})



app.get('/my-account/:id', (req, res) => {
    
    let dormItems = [];

    Dorm.find({owner_id: req.params.id}, (err, items) => {
        items.forEach(item => {
          dormItems.push(item)  
        })
    })

    Owner.find({owner_id: req.params.id}, (err, items) => {
        if(err){
            console.log(err);
            res.status(500).send('An error occured retrieving items', err);
        }
        else {
            res.render('my-account', { items: items, dormItems : dormItems});
        }
    })
})

app.get('/owner-info', (req, res) => {
    res.render('owner-info');
})


app.get('/register', (req, res) => {
    res.render('register.ejs');
})

// for auto-incrementing dorm id
// let maxOwnerId;
// Owner.count({}, (err, count) => {
//     maxOwnerId = count;
// })
Owner.findOne({}).sort('-owner_id').exec(function (err, member) {
    maxOwnerId = member.owner_id;
    
})


app.post('/register', async (req, res) => {
    maxOwnerId++;
    
    //authentication
    const { email, username, password } = req.body;
    let errors = [];

    Owner.findOne({ email: email })
        .then(owner => {
            if(owner) {
                //Email exists
                errors.push({ msg: "Email is already registered "})
                res.render('register', {
                    errors,
                    email,
                    username,
                    password
                })
            } else {
                Owner.findOne({ username: username })
                .then(owner => {
                    if(owner) {
                        //Username exists
                        errors.push({ msg: "Username is already taken "})
                        res.render('register', {
                            errors,
                            email,
                            username,
                            password
                        })
                    } else {
                        const newOwner = new Owner({
                            owner_id: maxOwnerId,
                            email: email,
                            username: username,
                            password: password,
                            isVerified: false
                        })
                        
                        // Hash Password
                        bcrypt.genSalt(10, (err, salt) => 
                            bcrypt.hash(newOwner.password, salt, (err, hash) => {
                                if(err) throw err;
                                
                                //Set password to hashed
                                newOwner.password = hash;

                                //Save user
                                newOwner.save()
                                .then(user => {
                                    req.flash('success_msg', "You are now registered and can log in");
                                    console.log("owner successfully registered")
                                    res.redirect("/verification/" + newOwner.owner_id)
                                })
                                .catch(err => console.log(err))
                            },
                        ))
                    }
                })
            }
        })



    // const hashedPassword = await bcrypt.hash(req.body.registerPw, 10)


    
    // newOwner.save()
    // .then(() => {
    //     console.log("succesfully stored owner data")
    //     res.redirect('/verification/' + newOwner.owner_id)
    // })
    // .catch((err) => {
    //     console.log(err)
    // })
})

app.get('/verification/:id', (req, res) => {
    res.render('verification');
})

app.post('/verification/:id', (req, res) => {
    res.render('verification');
})

//404
app.use((req, res) => {
    res.status(404).send("404")
})






