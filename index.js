const images = {
    octopus: "./octopus.svg"
}

module.exports = {
    template: 
    `<html>
    <head>
        <title>Octopus</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>

    <style> 
    html {
        font-size: 16px;
    }

    .container {
        width: 100%;
    }

    .d-flex {
        display: flex!important;
    }

    .flex-row {
        flex-direction: row!important;
    }

    .flex-column {
        flex-direction: column!important;
    }

    .justify-content-center {
        justify-content: center
    }

    .align-items-center {
        align-items: center
    }

    .m-t {
        margin-top: 1rem;
    }

    .m-y {
        margin: 1rem 0;
    }

    .helvetica {
        font-family: 'Helvetica', sans-serif;
    }

    .text-dark-gray {
        color: rgba(0,0,0,0.6)!important;
    }

    .text-light-gray {
        color: rgba(0,0,0,0.4)!important;
    }

    .text-heading {
        font-size: 3rem;
    }

    .text-large {
        font-size: 2rem;
    }

    .text-small {
        font-size: 0.5rem;
    }

    .img-svg {
        display: block;
    }

    .img-logo {
        background-image: url(${images.octopus}); 
        height: 10rem;
        width: 10rem;
        filter: grayscale(10%);
    }

    .v-rule:after {
        content: "";
        display: block;
        min-width: 80vw;
        min-height: 1px;
        text-align: center;
        background-color: rgba(0,0,0,0.3);
    }

    a {
        color: inherit;
        font-weight: 700;
    }

    </style>

    <body>
        <div class="container d-flex flex-column align-items-center m-t">
            <div class="text-heading text-dark-gray helvetica">Argonaut</div>
            <div class="img-svg img-logo"></div>
            <div class="text-light-gray helvetica m-t">The backend API</div>
            <div class="v-rule m-y"></div>
        </div>
    </body>

</html>`
}