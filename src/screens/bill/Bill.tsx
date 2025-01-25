import React, {useState, useEffect} from 'react';
import {
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import Print from 'react-native-print';
import commonstyles from '../../components/commonstyles';
import CustomText from '../../components/CustomText';
import addOrderStyles from '../order/addOrderStyles';
import {useGetOrderDetailsQuery} from '../../services/orderService';

const Bill = ({route}: any) => {
  const {details} = route.params;
  const [districtName, setDistrictName] = useState('Not mentioned');
  const {data, error, isLoading} = useGetOrderDetailsQuery({
    order_id: details?.order_id,
  });

  const [share, setShare] = useState(false);
  const booking_details = data?.booking_details || {};
  const booking_product_details = data?.booking_product_details || [];
  const total_order_price = booking_details.total_order_price || 0;
  const discount_amount = booking_details.discount_amount || 0;
  const discountPercentage = total_order_price
    ? ((discount_amount / total_order_price) * 100).toFixed(1)
    : '0.00';

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        const response = await fetch(
          `http://www.postalpincode.in/api/pincode/${booking_details?.billing_pin}`,
        );

        const result = await response.json();

        if (result.Status === 'Success' && result.PostOffice?.length > 0) {
          setDistrictName(result.PostOffice[0].District || 'Not mentioned');
        } else {
          setDistrictName('Not mentioned');
        }
      } catch (error) {
        console.error('Error fetching pincode details:', error);
        setDistrictName('Not mentioned');
      }
    };

    if (booking_details?.billing_pin) {
      fetchDistrict();
    }
  }, [booking_details?.billing_pin]);

  const productRows = booking_product_details
    .map(
      (product: any, index: any) => `
        <tr>
          <td>${index + 1}</td>
          <td>${product.product_name}</td>
          <td>${product.publisher_name ? product.publisher_name : 'None'}</td>
          <td>${product.quantity}</td>
          <td>
            <p>₹${product.price}</p>
          </td>
        </tr>
      `,
    )
    .join('');

  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: grey;
            font-size: 18px;
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
          }
          .header {
            width: 100%;
            text-align: left;
            margin-bottom: 20px;
          }
          .header img {
            width: 150px;
            margin-bottom: 10px;
          }
          .header h1 {
            font-size: 18px;
            margin: 10px 0;
          }
          .details {
            display: block;
            width: 100%;
            margin-bottom: 20px;
          }
        
          .details strong {
            font-weight: bold;
          }
          .details-container {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 20px;
          }
          .details-section {
            flex: 1;
            min-width: 45%;
            box-sizing: border-box;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin: 0 auto;
          }
          .table th, .table td {
            border: 1px solid #ddd;
            text-align: left;
            padding: 8px;
          }
          .table th {
            background-color: #f4f4f4;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: gray;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
              width: 100%;
              font-size: 16px;
              padding: 20px;
            }
            .table {
              width: 100%;
              border: 1px solid #ddd;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://staging.thinkerslane.com/public/assets/images/calligraphy_Suprokash.png" alt="Logo" />
          <h1>Tax Invoice/Bill of Supply/Cash Memo</h1>
        </div>
        <div class="details-container">
          <div class="details-section">
            <div class="details">
              <p><strong>Sold By:</strong><br> 16, Radhanath Mullick Lane, College Street, Kolkata : 700012</p>
              <p><strong>Billing Address:</strong><br> ${booking_details.name}<br> ${booking_details.billing_address}, P.O- ${booking_details.billing_city}-${booking_details.billing_pin}<br> Dist- ${districtName}<br> Mobile :${booking_details.mobile}</p>
            </div>
          </div>
          <div class="details-section">
            <div class="details">
              <p><strong>Order No: </strong>${booking_details.unique_code}</p>
              <p><strong>Order Date: </strong>${booking_details.order_date_time}</p>
              <p><strong>Invoice No: </strong>IN-${booking_details.id}</p>
              <p><strong>Invoice Date: </strong>${booking_details.order_date_time}</p>
              <p><strong>Discount Added: </strong>₹${booking_details.discount_amount}</p>
            </div>
          </div>
        </div>
        <table border="1" cellpadding="5" class="table">
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Publisher</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          ${productRows}
        </table>
        <div style="text-align:center">
          <p><strong>Discount Amount: </strong>₹${booking_details.discount_amount} (${discountPercentage}%)</p>
          <p><strong>Grand Total: </strong>₹${booking_details.amount}</p>
        </div>
        <div class="footer">
          <p>For Thinkerslane<br> Authorized Signatory</p>
        </div>
      </body>
    </html>`;

  const navigation = useNavigation<any>();

  const generatePDF = async () => {
    try {
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'Invoice',
        base64: false,
        width: 612,
        height: 792,
      });
      return pdf.filePath;
    } catch (error) {
      Toast.show({
        text1: 'There is an issue. Please try again later',
        type: 'error',
        position: 'top',
      });
    }
  };

  const sharePDF = async () => {
    try {
      setShare(true);
      const pdfPath = await generatePDF();
      if (pdfPath) {
        const options = {
          url: `file://${pdfPath}`,
          type: 'application/pdf',
          title: 'Share Invoice',
        };
        setShare(false);
        await Share.open(options);
      }
    } catch (error) {
      setShare(false);
    } finally {
      setShare(false);
    }
  };

  const printPDF = async () => {
    const pdfPath = await generatePDF();
    if (pdfPath) {
      Print.print({filePath: pdfPath}).catch(() => {});
    }
  };

  const handleDoneAction = () => {
    navigation.navigate('Dashboard');
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color={commonstyles.thinkerslane.color}
        />
        <CustomText style={styles.loaderText}>Generating Bill...</CustomText>
      </View>
    );
  }

  if (share) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color={commonstyles.thinkerslane.color}
        />
        <CustomText style={styles.loaderText}>Generating PDF...</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}
          onPress={printPDF}>
          <Ionicons
            name="print"
            color={commonstyles.thinkerslane.color}
            size={24}
            style={{margin: 10}}
          />
          <CustomText style={addOrderStyles.bookContainer}>Print</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}
          onPress={sharePDF}>
          <FontAwesome5
            name="share-alt-square"
            color={commonstyles.thinkerslane.color}
            size={24}
            style={{margin: 10}}
          />
          <CustomText style={addOrderStyles.bookContainer}>Share</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}
          onPress={handleDoneAction}>
          <Ionicons
            name="checkmark-done"
            color={commonstyles.thinkerslane.color}
            size={24}
            style={{margin: 10}}
          />
          <CustomText style={addOrderStyles.bookContainer}>Done</CustomText>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <WebView
          source={{html: htmlContent}}
          style={styles.webView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  webView: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: commonstyles.thinkerslane.color,
  },
});

export default Bill;
