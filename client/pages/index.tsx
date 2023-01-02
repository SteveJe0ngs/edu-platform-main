import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Select,
  Stack,
  Text
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { Component, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../recoil";
import { checkIsValid } from "../config";
import EnterLayout from "../components/EnterLayout";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailInvalid, setEmailInvalid] = useState(false);

  const emailReg = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9.]+$");

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setEmail(inputValue);
    setEmailInvalid(checkIsValid(emailReg, inputValue));
  };

  const handleLoginOnClick = async () => {
    if (checkIsValid(emailReg, email)) {
      return;
    }
    //login

    const loginRes = (
      await axios.post("api/login", { email: email, pw: password })
    ).data;
    
    if(loginRes["state"] === "success"){
      const updatedUser = {
        userName: loginRes.info.userName,
        userId: loginRes.info.userId,
        userEmail: loginRes.info.userEmail,
        type: (loginRes.info.type === null) ? 1 : loginRes.info.type
      };
      setUser(updatedUser);

      localStorage.setItem("token", loginRes["token"]);

      if(loginRes.info.type === null) router.push("/test");
      else router.push("/main");
    }
    else{
      alert(loginRes["msg"]);
    }
  };

  return (
    <EnterLayout>
      <>
        <FormControl mb={8} isRequired isInvalid={isEmailInvalid}>
          <FormLabel fontSize={16}>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={handleEmailInputChange}
            borderRadius="2xl"
            borderWidth={"2px"}
            borderColor={"rgb(144, 187, 144)"}
          />
          {isEmailInvalid && (
            <FormErrorMessage>Email address is invalid.</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mb={14} isRequired>
          <FormLabel fontSize={16}>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            borderRadius="2xl"
            borderWidth={"2px"}
            borderColor={"rgb(144, 187, 144)"}
          />
        </FormControl>
        <Button
          width="100%"
          borderRadius={"2xl"}
          bgColor=" rgb(144, 187, 144)"
          _hover={{ bgColor: "green" }}
          onClick={handleLoginOnClick}
          mb={5}
        >
          Login
        </Button>
        <Button
          height="40px"
          width="100%"
          borderRadius={"2xl"}
          bgColor="#DD9D9"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </Button>
      </>
    </EnterLayout>
  );
}
