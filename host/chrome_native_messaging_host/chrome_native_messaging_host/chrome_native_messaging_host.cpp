// chrome_native_messaging_host.cpp : 定义控制台应用程序的入口点。
// Title: native messaging c++ program 
// Author: justin 
// Date: 2018-06-08 
  
#include "stdafx.h"
#include <stdio.h>  
#include <fcntl.h>  
#include <io.h>     

//#include "SimpleLog.h"  
#include <iostream>  
#include <string>  
#include <sstream>  
using namespace std;  

void sendMessage(const string &strMsg)  
{  
	// We need to send the 4 bytes of length information  
	unsigned int len = strMsg.length();  
	std::cout << char(((len >> 0) & 0xFF))  
		<< char(((len >> 8) & 0xFF))  
		<< char(((len >> 16) & 0xFF))  
		<< char(((len >> 24) & 0xFF));  
	//output integer value directly will lead byte order problem.  

	// Now we can output our message  
	cout << strMsg;  
	cout.flush();  
}  

int _tmain(int argc, _TCHAR* argv[])
{
	//sendMessage("111111111");
	//return 0;

	_setmode(_fileno(stdin), O_BINARY);  
	_setmode(_fileno(stdout), O_BINARY);  
	_setmode(_fileno(stderr), O_BINARY);  

	int bufSize;  
	do   
	{  
		bufSize = 0;  

		//unlike >> operator and scanf function,   
		//read function will wait until read all 4 bytes!  
		cin.read((char*)&bufSize, 4);  

		stringstream ss;  
		ss << "bufSize = " << bufSize << endl;  

		if (bufSize> 0)  
		{  
			char *pData = new char[bufSize+1];  
			memset(pData, 0, bufSize + 1);  
			cin.read(pData, bufSize);  

			string response = "{\"echo\":";  
			response.append(pData);  
			response.append("}");  

			sendMessage(response);  

			delete pData;  
		}
		else  
		{  
			break;   
		}  
	} while (true);  


	return 0;  
}
