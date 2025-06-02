from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import StockPredictionSerializer
from rest_framework import status
from rest_framework.response import Response
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import os
from django.conf import settings
from .utils import save_plot



class StockPredictionAPIView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']
            
            # Fetch the data from yfinance
            now = datetime.now()
            start = datetime(now.year-10, now.month, now.day)
            end = now
            df = yf.download(ticker, start, end)
            print(df)
            if df.empty:
                return Response({"error": "No data found for the given ticker.",
                                 "status": status.HTTP_404_NOT_FOUND})
            df = df.reset_index()
            # Generate Basic Plot
            plt.switch_backend("AGG")
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label="Closing Price")
            plt.title(f"Closing price of {ticker}")
            plt.xlabel("Days")
            plt.ylabel("Close price")
            plt.legend()
            # Save the plot to a file
            plot_img_path = f"{ticker}_plot.png"
            plot_img = save_plot(plot_img_path)
            
            # 100 Days moving average
            ma100 = df.Close.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label="Closing Price")
            plt.plot(ma100, 'r', label='100 DMA')
            plt.title(f"Closing price of {ticker}")
            plt.xlabel("Days")
            plt.ylabel("Close price")
            plt.legend()
            plot_img_path = f"{ticker}_100_dma.png"
            plot_100_dma = save_plot(plot_img_path)
            
            return Response({'status': 'success', 
                             'plot_img': plot_img,
                             'plot_100_dma': plot_100_dma,
                             })
