// GOOGLE
import axios from "axios";
// import qs from "qs";

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function getGoogleUser({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserResult | null> {
  try {
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error(error.message, "Error fetching Google user");
    return null;
  }
}

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult | null> {
  console.log("reached");
  const url = "https://oauth2.googleapis.com/token" as string;

  // const values = {
  //   code,
  //   client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
  //   client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  //   redirect_uri: process.env.GOOGLE_OAUTH_CLIENT_REDIRECT_URL,
  //   grant_type: "authorization_code",
  // };
  // console.log({ values });
  // console.log("qs", qs);
  const data = `code=${code}&client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}&client_secret=${process.env.GOOGLE_OAUTH_CLIENT_SECRET}&redirect_uri=${process.env.GOOGLE_OAUTH_CLIENT_REDIRECT_URL}&grant_type=authorization_code`;
  try {
    const res = await axios.post<GoogleTokensResult>(
      url,
      // qs.stringify(values),
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error(error.message, "Failed to fetch Google Oauth Tokens");
    return null;
  }
}
