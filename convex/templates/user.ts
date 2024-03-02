import Handlebars from "handlebars";

export const ResetPasswordEmailTemplate = Handlebars.compile(`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link href="https://fonts.cdnfonts.com/css/graphik" rel="stylesheet" />
    <link href="https://fonts.cdnfonts.com/css/mordeka" rel="stylesheet" />

    <title>Password Reset Code</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        background: #edeff2;
        font-family: "Graphik", sans-serif;
        font-weight: 400;
      }
      .main-container {
        max-width: 600px;
        width: 100%;
        background-color: #ffffff;
        margin: 4rem auto;
      }
      .top-container {
        padding: 24px 0 48px 0;
      }
      .px-56 {
        padding: 0 24px !important;
      }
      .py-40 {
        padding: 40px 0 !important;
      }
      .py-24 {
        padding: 24px 0 !important;
      }
      .py-20 {
        padding: 40px 0 !important;
      }

      .font-16 {
        font-size: 16px;
        color: #3c4049 !important;
        line-height: 24px;
        font-weight: 400;
      }
      .f-12 {
        font-size: 12px;
        font-weight: 500;
        color: #5c6370;
      }
      .f-10 {
        font-size: 10px;
        font-weight: 500;
        color: #5c6370;
      }
      .f-14 {
        font-size: 14px !important;
        color: #5c6370;
      }
      .font-20 {
        font-size: 20px;
        color: #3c4049 !important;
        line-height: 24px;
        font-family: "Mordeka", sans-serif;
      }
      .f-32 {
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
      }
      .font-40 {
        font-size: 40px;
        color: #083b9b !important;
        font-weight: 500;
        line-height: 48px;
      }
      .container-footer {
        background: #f8f8f8;
        padding: 40px 24px;
      }
      .app-container {
        max-width: 320px;
        margin: auto;
      }

      @media screen and (max-width: 485px) {
        .top-container {
          padding: 18px 0 28px 0 !important;
        }
        .px-56 {
          padding: 0 12px !important;
        }
        .py-40 {
          padding: 20px 0 !important;
        }
        .py-20 {
          padding: 40px 0 !important;
        }
        .py-24 {
          display: none !important;
        }
        .f-12 {
          font-size: 10px !important;
          font-weight: 500;
          color: #5c6370;
        }
        .f-14 {
          font-size: 12px !important;
          color: #5c6370;
        }
        .font-16 {
          font-size: 14px !important;
          color: #3c4049;
        }
        .font-20 {
          font-size: 16px !important;
          font-family: "Mordeka", sans-serif;
        }
        .f-32 {
          font-size: 18px !important;
          font-style: normal;
          font-weight: 600;
        }
        .container-footer {
          background: #f8f8f8;

          padding: 40px 12px;
        }
        .word-break {
          width: 135px !important;
          word-wrap: break-word !important;
        }
        .hr-0 {
          display: none;
        }
        .header_sm {
          margin-top: 40px !important;
          font-size: 11px;
        }

        .d-block {
          display: block;
          width: 100%;
          margin-bottom: 10px !important;
        }
        .hy-4 {
          padding: 8px 0 !important;
        }
        .word-break {
          width: 100% !important;
        }
        .font-40 {
          font-size: 30px;
          color: #083b9b !important;
          font-weight: 500;
          line-height: 38px;
        }
        .app-container {
          max-width: 100%;
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <div class="main-container">
      <div class="top-container">
        <div class="px-56" style="margin: 24px 0px">
          <img
            src="https://i.ibb.co/3krjwsK/1000198972.jpg"
            width="80px"
            height="auto"
          />
        </div>

        <div class="px-56">
          <h2
            class="font-20"
            style="margin-bottom: 16px; font-weight: 500; color: #3c4049"
          >
            Password Reset Code
          </h2>
          <p class="font-16" style="margin-bottom: 16px">hey {{did}},</p>
          <p class="font-16" style="margin-bottom: 24px">
            You have requested a password reset for your account. Below is your
            unique verification code:
          </p>
          <h3 class="font-20" style="margin-bottom: 24px">{{ resetCode }}</h3>
          <p class="font-16" style="margin-bottom: 24px">
            If you did not request a password reset, please ignore this email.
            Otherwise, use the provided code to reset your password.
          </p>
          <p class="font-16">Best</p>
          <p class="font-16" style="margin-bottom: 16px">
            The FinsightAI Team.
          </p>

          <p class="font-16">
            Please contact us at
            <a style="color: #0047cc; text-decoration: none"
              >hey@finsightai@.co
            </a>
            if you have any comments, questions, or issues.
          </p>
        </div>
      </div>

      <div class="container-footer">
        <img
          src="https://i.ibb.co/3krjwsK/1000198972.jpg"
          width="80px"
          height="auto"
        />
        <p
          class="f-12"
          style="
            margin-top: 24px;
            line-height: 16px !important;
            font-weight: 400 !important;
          "
        >
          You are receiving this message because you signed up on
          <a style="color: #0047cc; text-decoration: none" href="#"
            >Finsight AI</a
          >. For more information about how we process data, please see our
          <a style="color: #0047cc; text-decoration: none" href="#"
            >privacy policy</a
          >.
        </p>

        <p
          class="f-10"
          style="color: #5c6370; margin-top: 24px; line-height: 20px"
        >
          Copyright (c) {{year}} Finsight AI. All rights reserved.
        </p>

        <div style="margin-top: 24px">
          <a
            href="https://www.linkedin.com/company/finsightai/"
            style="margin-right: 10px"
          >
          linkedin
          </a>
          <a href="https://twitter.com/finsightai">
          twiter
          </a>
        </div>
      </div>
    </div>
  </body>
</html>
`);
