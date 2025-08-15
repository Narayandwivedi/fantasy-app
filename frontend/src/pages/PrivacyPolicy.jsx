import React, { useContext } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      {user ? (
        // Back button for logged-in users
        <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black py-3 px-6 shadow-xl">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 p-2 rounded-lg cursor-pointer transition-all duration-200 group mr-4"
            >
              <ArrowLeft className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors duration-200" />
            </button>
            <h1 className="text-white text-xl font-bold tracking-wide">
              Privacy Policy
            </h1>
          </div>
        </div>
      ) : (
        // Landing navbar for non-logged-in users
        <LandingNavbar />
      )}
      
      {/* Header - Only show for non-logged-in users */}
      {!user && (
        <div className="bg-gradient-to-r from-gray-800 to-slate-800 py-6 px-6 lg:px-16 shadow-xl">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ArrowLeft className="w-6 h-6 text-white hover:text-yellow-300 transition-colors" />
              </Link>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-wide">Privacy Policy</h1>
                <p className="text-gray-300 text-sm lg:text-base mt-1">Your privacy matters to us</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-yellow-300" />
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b pb-4">
          MySeries11 Privacy Policy
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            The privacy policy and personal information safety related to the services and Fun Features offered by MySeries11 are defined in this document.
          </p>
          
          <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4 italic">
            "MySeries11 is neither associated with nor claims any responsibility or official status with any of the official or non-official sportsperson or team. Further, the MySeries11 platform is not associated or affiliated with any private or government sports leagues/tournaments in any manner unless stated by the organization itself."
          </p>
          
          <p>
            MySeries11.com is an online fantasy sports gaming platform which is in the business of providing its users to play online fantasy sports game against each other.
          </p>
          
          <p>
            The individuals using the services or Fun Features provided by MySeries11, or participating in any of the program(s) or contest(s) organised by MySeries11 is bound to comply by these Privacy policies defined by MySeries11.
          </p>
          
          <p>
            MySeries11.com ensures to maintain and protect the privacy of the individuals using the services, Fun Features and contest(s) offered by MySeries11.
          </p>
          
          <p>
            MySeries11 offers a variety of Fun Features to enhance the user experience which can be studied in details in the <strong>"About Us"</strong> section of our website. The individuals using the Fun Features and services provided by MySeries11 are required to create and register an account with MySeries11 in order to avail the services offered by MySeries11.
          </p>
          
          <p>
            All capitalised terms not defined herein shall have the meaning ascribed to them in the Terms.
          </p>
          
          <p>
            We respect the privacy of its User(s) and are committed to protect it in all respects. With a view to offer an enriching and holistic internet experience to its Users, We offer a vast repository of Services on Our Platform. Kindly take time to read the "About Us" section to know more. Most of the Services are offered for free but you need registration to participate in the Contests. The information about the User(s) is collected by Us as (i) information supplied by User(s) and (ii) information automatically tracked during User(s)' navigation on the Platform.
          </p>
          
          <p>
            Before you submit any information on the Platform, please read this Privacy Policy for an explanation of how We will treat Your information. By using any part of the Platform, You consent to the collection, use, disclosure and transfer of Your information for the purposes outlined in this Privacy Policy and to the collection, processing and maintenance of this information. Your use of any part of the Platform indicates Your acceptance of this Privacy Policy and of the collection, use and disclosure of Your information in accordance with this Privacy Policy.
          </p>
          
          <p>
            While You have the option not to provide Us with certain personal information, withdraw Your consent to collect certain information, request temporary suspension of collection of personal information or request deletion of personal information collected, kindly note that in such an event You may not be able to take full advantage of the entire scope of features and services offered to You and We reserve the right not to provide You with Our services.
          </p>
          
          <p>
            In the ever-evolving medium of the internet, We reserve our right to periodically review and change Our Privacy Policy to incorporate such future changes as may be considered appropriate and under applicable laws. We will notify You of the change. Any changes to Our Privacy Policy will be posted on this page, so You are always aware of what information We collect, how We use it, how We store it and under what circumstances We disclose it.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Purpose and Usage
          </h2>
          
          <p>
            To avail certain features on the Platform, Users may be required to provide following information for the registration process, namely:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Username</li>
            <li>Email address</li>
            <li>Date of birth</li>
            <li>State</li>
            <li>Government ID such as aadhaar card or driving license or voter id</li>
          </ul>
          
          <p>
            Additionally in the course of providing You with access to the Platform and the Services offered by Us, You agree to give Us the permission to capture and record Your device related information, operating system information, network information, location information etc. You may choose to allow Us to gather information in relation to the apps installed on Your device in order for Us to better our Services and Your experience on the Platform. You may also be required to furnish additional information, including Your Permanent Account Number.
          </p>
          
          <p>
            In certain instances, We may also collect sensitive personal information from You on the Platform. SPI means such personal information which consists of information relating to Your financial information, such as information regarding the payment instrument/modes used by You to make such payments, which may include cardholder name, credit/debit card number (in encrypted form) with expiration date, banking details, wallet details etc. ("SPI"). This information is presented at the time of making a payment to enable You to complete Your payment expeditiously.
          </p>
          
          <p>
            Except for any financial information that You choose to provide while making payment for any Services on the Platform, We do not collect any other SPI in the course of providing the Services. Any SPI collected by Us shall not be disclosed to any third-party service provider without Your express consent, save as otherwise set out in this Privacy Policy or as provided in a separate written agreement between Us and You or as required by law. It is clarified that this condition shall not apply to publicly available information, including SPI, in relation to You on the Platform.
          </p>
          
          <p>
            We collect and use personal information provided by You (that is, information that may be used to identify You and that is not otherwise publicly available) to operate, provide, develop, and improve our Services, keeping you informed of Our offerings, and the products and/or services of Our affiliates and group entities, and to enable Our affiliates and group entities to reach out to You in relation to the products and services offered by them.
          </p>
          
          <p>
            In the course of providing the Services, User(s) may invite other existing User(s) or other users ("Invited Users") to participate in any of the Services through any social media platform including without limitation, Facebook, WhatsApp, Instagram etc. We may thereafter use this information to contact the Invited User and invite such user to register with Our Platform (if such Invited User is not an existing User) and participate in the Contest in relation to which such person was invited by you. The participation of the Invited User in any Contest shall be subject to the terms of this Privacy Policy and the Terms for the use of the Platform. You hereby represent that the Invited Users have consented and agreed to such disclosure of their information with Us, Our affiliates and/ or Our group entities. You may also choose to invite Your friends by syncing your phonebook and inviting them directly from the Platform to utilize Our Services and/or to play the Contests.
          </p>
          
          <p>
            All required information is specific and based on the kind of Services and/or Contests the User wishes to participate in or access, and will be utilized to provide the same.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Disclosure/Sharing
          </h2>
          
          <p>
            We may share information as provided by You and data concerning Your usage of the Services and participation in the Contests with Our affiliates and group entities to enable them to reach out to you in relation to the products and/or services offered by them. We may also share such information with third party service providers engaged by Us, for the purpose of data analytics or for the purpose of storage, improving the services (including product enhancements) and to help Us serve you better. Provided that affiliate, group entity and third-party service provider (as may be applicable) with whom the information is shared will be required, on best efforts basis, to comply with the same standards as applicable to Us in relation to maintaining the security of the information.
          </p>
          
          <p>
            By using the Platform, You hereby expressly agree and grant consent to the collection, use and storage of your information by Us. We reserve the right to share, disclose and transfer information collected hereunder with Our affiliates and group entities. In the event We sell or transfer all or a portion of Our business assets, consumer information may be one of the business assets that is shared, disclosed or transferred as part of the transaction. You hereby expressly grant consent and permission to Us for disclosure and transfer of personal information for the same.
          </p>
          
          <p>
            We may share information and data concerning usage of the Services and participation in the Contests with Our commercial partners for the purpose of facilitating user engagement, for marketing and promotional purposes and other related purposes.
          </p>
          
          <p>
            Further, We reserve the right to disclose/share information with affiliates, group entities and third parties in limited circumstances, including for the purposes of complying with applicable law, responding to duly authorized legal process, governmental requests, preventing fraud or imminent harm, and ensuring the security of Our network and services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Use of Cookies
          </h2>
          
          <p>
            To improve the effectiveness and usability of the Platform for our Users, We use "cookies", or such similar electronic tools to collect information to assign each visitor a unique random number as a User Identification (User ID) to understand the User's individual interests using the identified device. Unless the User voluntarily identifies himself/herself (e.g., through registration), We have no way of knowing who the User is, even if we assign a cookie to the User's device. The only information a cookie can contain is information supplied by the User. A cookie cannot read data off the User's device hard drive. Our advertisers may also assign their own cookies to the User's device (if the User clicks on their ad banners), a process that We do not control.
          </p>
          
          <p>
            Our web servers automatically collect limited information about User's device connection to the Internet, including User's IP address, when the User(s) uses the Platform (User's IP address is a number that lets devices attached to the Internet know where to send data to the User -- such as the web pages viewed by the User). The User's IP address does not identify the User personally. We use this information to deliver our web pages to User(s) upon request, to tailor our Platform to the interests of Our User(s), to measure traffic within the Platform and let advertisers know the geographic locations from where Our visitors come.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Links
          </h2>
          
          <p>
            We also include links to other websites. Such websites are governed by their respective privacy policies, which are beyond Our control. Once the User(s) leaves Our servers (the User can tell where he/she is by checking the URL in the location bar on the User's browser), use of any information provided by the User is governed by the privacy policy of the operator of the site which the User is visiting. That policy may differ from Our Privacy Policy. If the User can't find the privacy policy of any of these sites via a link from the site's homepage, the User may contact the site directly for more information. We are not responsible for the privacy practices or the content of such third-party websites.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Security Procedures
          </h2>
          
          <p>
            All information gathered on Our Platform is securely stored within a controlled database. The database is stored on servers secured behind a firewall; access to such servers being password-protected and strictly limited based on need-to-know basis. However, we understand that as effective as Our security measures are, no security system is impenetrable. Thus, We cannot guarantee the security of Our database, nor can We guarantee that information You supply will not be intercepted while being transmitted to Us over the internet. Further, any information You include in a posting to the discussion areas will be available to anyone with internet access. By using the Platform, you understand and agree that Your information may be used in or transferred to countries other than India.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Advertising
          </h2>
          
          <p>
            When We present information to Our online advertisers - to help them understand Our audience and confirm the value of advertising on the Platform - it is usually in the form of aggregated anonymized data (information that cannot be used to trace a user) of User(s) that may include statistics and/or data concerning User traffic, User responsiveness and User behaviour to such advertisements on our Platform. When you register with Us, We contact you from time to time about updating Your content to provide features which we believe may benefit You.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Disclaimer
          </h2>
          
          <p>
            Several deceptive emails, websites, blogs etc. claiming to be from or associated with Our Platform may or are circulating on the Internet ("Deceptive Communication"). Such Deceptive Communication may include our logo, photos, links, content or other information. Some Deceptive Communication may call the User(s) requesting the User(s) to provide login name, password etc. or inform the User(s) that the User(s) has won a prize/ gift or provide a method to commit an illegal/ unauthorized act or deed or request detailed personal information or a payment of some kind. The sources and contents of these Deceptive Communications and accompanying materials are in no way associated with Us. For Your own protection, We strongly recommend not responding to such Deceptive Communication without verifying the genuineness. You agree that We shall not be liable for any loss, damage and harm that You may suffer by relying and/or acting upon such Deceptive Communications.
          </p>
          
          <p>
            Except, as provided for the purpose of verification, as set out under the Terms, We and/or Our employees will not contact You to divulge your SPI.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Conditions of Use
          </h2>
          
          <p>
            We do not warrant that this platform, our servers, or email sent by us or on our behalf are virus-free. We will not be liable for any damages of any kind arising from the use of this platform, including, but not limited to compensatory, direct, indirect, incidental, punitive, special or consequential damages, Loss of Data, goodwill, business opportunity, income or profit, loss of or damage to property and claims of third parties. In no event will we be liable for any damages whatsoever in an amount in excess of an amount of INR 100.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Retention of Data
          </h2>
          
          <p>
            Your personal information may be retained and may continue to be used until: (i) the relevant purposes for the use of Your personal information described in this Privacy Policy are no longer applicable; and (ii) We are no longer required by applicable law, regulations, contractual obligations or legitimate business purposes to retain Your personal information and the retention of Your personal information is not required for the establishment, exercise or defense of any legal claim.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            User Account and Data Deletion
          </h2>
          
          <p>
            User(s) are entitled to request Us to delete their accounts and their personal information by sending an email with their written request to{' '}
            <a href="mailto:myseries11assist@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
              myseries11assist@gmail.com
            </a>.
          </p>
          
          <p>
            We will do our best to respond promptly and in any event within one month of the following:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Our receipt of Your written request; or</li>
            <li>Our receipt of any further information We may ask you to provide, to enable Us to comply with Your request, whichever is later.</li>
          </ul>
          
          <p>
            As an alternative to account deletion, by writing to{' '}
            <a href="mailto:myseries11assist@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
              myseries11assist@gmail.com
            </a>, You also have the option to request either:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>the suspension of Your account, after which You will not be able to play paid contests on your User account but will continue to have access to other parts of the Platform; or</li>
            <li>temporary deactivation of Your account, where you will no longer be able to log into the Platform but which allows You to request reactivation of your account with all Your account data.</li>
          </ul>
          
          <p>
            If You proceed with permanent deactivation of your account, you will lose access to the Platform and the Services, including any User data and personal information associated with Your account. User(s) may request for account restoration within six (6) months from the date of notification of account deletion by writing to Us on{' '}
            <a href="mailto:myseries11assist@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
              myseries11assist@gmail.com
            </a>.
          </p>
          
          <p>
            When You request deletion of Your data, We follow a deletion process that ensures that Your data is safely and completely removed from Our servers or retained only in anonymised form. We try to ensure that Our services protect information from accidental or malicious deletion. Because of this, there may be delays between when You request deletion and when copies are deleted from our active and backup systems.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Applicable Law and Jurisdiction
          </h2>
          
          <p>
            By visiting this Platform, you agree that the laws of the Republic of India without regard to its conflict of laws principles, govern this Privacy Policy and any dispute arising in respect hereof shall be subject to and governed by the dispute resolution process set out in the Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Updating Information
          </h2>
          
          <p>
            You will promptly notify Us if there are any changes, updates or modifications to Your personal information. Further, You may also review, update or modify Your personal information and User preferences by logging into Your profile page on the Platform.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Contact Us
          </h2>
          
          <p>
            Any questions or clarifications with respect to this Privacy Policy or any complaints, comments, concerns or feedback can be sent to Us at:{' '}
            <a href="mailto:myseries11assist@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
              myseries11assist@gmail.com
            </a>
          </p>
          
          <p className="bg-gray-50 p-4 rounded-md">
            This app features materials protected by the Fair Use guidelines of the Copyright Act. All rights reserved to the copyright owners. MySeries11 doesn't claim any rights.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Changes to Privacy Policy
          </h2>
          
          <p>
            Subsequently, we may change this privacy policy to accommodate new technologies, industry practices, regulatory requirements or for other purposes. We will provide notice to you if these changes are material and, where required by applicable law, we will obtain your consent.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            Contact
          </h2>
          
          <p>
            Questions, comments and requests regarding this privacy policy are welcomed and should be addressed to
          </p>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="font-semibold">
              E-mail id:{' '}
              <a href="mailto:myseries11assist@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
                myseries11assist@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer - Only show for non-logged-in users */}
      {!user && <Footer />}
    </div>
  );
};

export default PrivacyPolicy;