import React from 'react'

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-16 px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Terms and Conditions</h1>
        </div>
        
        <div className="p-8 lg:p-12 xl:p-16">
          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              1. Introduction - Who We Are and What We Do
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">
              We are <strong className="text-gray-800">MySeries11.com</strong>, offering Our Platform to You and an opportunity for You to participate in Contests spanning across a broad range of officially sanctioned live sporting events ("Services"). An illustrative list of such sporting events is mentioned below as maybe modified from time to time ("Sports"):
            </p>
            <div className="flex flex-wrap gap-2 my-6">
              {['Cricket', 'Football', 'Basketball', 'Baseball', 'Hockey', 'Handball', 'Volleyball', 'Kabaddi'].map((sport, index) => (
                <div key={index} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-center font-medium hover:bg-blue-600 transform hover:-translate-y-1 transition-all duration-200 shadow-md text-sm flex-shrink-0">
                  {sport}
                </div>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed">
              Any person using, accessing and/or participating in any fantasy sports-related free-to-play online gaming contests ("Practice Contest") and/or pay-to-play online gaming contests ("Paid Contest") on Our Platform is a user ("User"). All references to "You/Your" relate to the User. All references to "We/Us/Our" relate to "MySeries11.com" which denotes a collective reference to the MySeries11.com mobile application and the MySeries11.com website (hereinafter collectively referred to as "Platform"). Practice Contest and Paid Contest are hereinafter collectively referred to as "Contests".
            </p>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              2. Acceptance of Our Terms and Conditions
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">
              Your continued usage of Our Platform constitutes Your acceptance of the terms and conditions, including any additional terms that We may make available to You ("Terms") and are contractually binding on You.
            </p>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">
              You accept that in the event of any variance between these Terms and any additional terms relating to the usage of Our Platform or any Contest, the additional terms will prevail.
            </p>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">
              By accepting these Terms, You agree and consent to receive communications from Us and/or Our partners, licensors or associates for any purpose through the following modes:
            </p>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2 ml-4">
              <li>Announcements</li>
              <li>Administrative messages/direct messages</li>
              <li>Advertisements</li>
              <li>Direct notification to your account</li>
              <li>By any other means that We may consider fit for this purpose</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              You agree that You shall mark Us as a safe sender on all Your platforms where You receive any such communications from Us (including via email and SMS) to ensure such communications are not transferred to the spam/junk folder.
            </p>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              3. User Account
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">
              You are required to register on Our Platform to create an account to access Our Services ("Account"). At the time of creating Your Account and/or at any time during the utilisation of Our Services, You will be required to provide any and/or all of the following information and/or documents:
            </p>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2 ml-4">
              <li>Your full name</li>
              <li>Your team name</li>
              <li>Your mobile number</li>
              <li>Your full address and state of residence</li>
              <li>Your gender</li>
              <li>Your date of birth</li>
              <li>Aadhar number</li>
              <li>Any other valid identification</li>
              <li>Bank Account information</li>
              <li>UPI ID</li>
              <li>Permanent Account Number (PAN)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We reserve the right to conduct KYC as may be required from time to time in the manner prescribed under such law.
            </p>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              4. Eligibility
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">To participate in any Paid Contest, you must meet the following eligibility criteria:</p>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2 ml-4 mb-4">
              <li>You must be above the age of 18 years</li>
              <li>You must be residing in India</li>
              <li>You must have a valid Indian mobile number to create an Account</li>
            </ul>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">Please note that Paid Contests are not permitted in the following states ("Restricted States"):</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <ul className="list-disc list-inside text-red-700 font-medium space-y-1">
                <li>Andhra Pradesh</li>
                <li>Assam</li>
                <li>Nagaland</li>
                <li>Sikkim</li>
                <li>Telangana</li>
              </ul>
            </div>
            <p className="text-gray-600 leading-relaxed">
              You agree that You are not from any of these Restricted States and You shall refrain from making any false disclosures, declarations and/or representations to Us to circumvent the applicable laws and/or regulations of the territory of India ("Applicable Law") of the Restricted States to participate in any Paid Contests.
            </p>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              5. Contest Rules and Format
            </h2>
            <h3 className="text-xl font-medium text-gray-700 mb-3">Contest Rules</h3>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">You agree and acknowledge that:</p>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2 ml-4">
              <li>To participate in a Contest(s), You are required to create a fantasy team ("Team"), by selecting real-life players who are participating in the specific Sports</li>
              <li>You must finalise Your Team for the relevant Contest before the start time and/or any other adjusted time of the Sports ("Contest Deadline")</li>
              <li>Each Contest will require a minimum number of Users to participate in the Contest for it to become operational ("Pre-specified Number of Users")</li>
              <li>You may participate in the Paid Contests by paying a pre-designated amount as specified on the relevant Contest page ("Pre-Designated Amount")</li>
              <li>You can participate in up to 2000 Contests per match in cricket and up to 500 Contests per match in any other sports</li>
              <li>You can only create a maximum of 30 (thirty) Teams for any Contest You are participating in</li>
            </ul>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              6. Payment Terms
            </h2>
            <h3 className="text-xl font-medium text-gray-700 mb-3">Payment Accounts</h3>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">By accessing and using Our Platform, You are provided with the following categories of accounts:</p>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2 ml-4 mb-4">
              <li><strong className="text-gray-800">Unutilized Account</strong> - This account holds any amount remitted by You through a designated payment gateway for availing Our Services</li>
              <li><strong className="text-gray-800">Winning Account</strong> - This account holds your winnings in any Paid Contests</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-700 mb-3">Taxes Payable</h3>
            <p className="text-gray-600 leading-relaxed">From 01 October 2023, 28% GST is applicable on the amount deposited by You in Your Unutilised Account. All winnings shall be subject to deduction of tax ("TDS") as per the Income Tax Act 1961. With effect from 1st April 2023, TDS of 30% shall be deducted from Net Winnings ("NW") on each withdrawal request placed by You.</p>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              7. User Conduct
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">In using and accessing Our Platform, You agree to observe the following code of conduct:</p>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2 ml-4">
              <li>You are permitted to create only one Account on Our Platform</li>
              <li>You will provide true, accurate and updated information and documentation</li>
              <li>You will maintain the confidentiality of all information relating to Your Account</li>
              <li>You agree to comply with Applicable Laws</li>
              <li>You shall not engage in any Fair Play Violation</li>
              <li>You shall not engage in any form of insider trading</li>
            </ul>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              8. Intellectual Property Rights
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You agree that We (including Our partners, licensors and/or associates) own all intellectual property rights in and to the software underlying the creation of Our Platform, including all material and content published by Us on Our Platform.
            </p>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              9. Privacy Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All Your personal information collected (including financial data) is subject to Our Privacy Policy which is available at the Privacy Policy page on our website. You are encouraged to review this Privacy Policy to understand the data we collect and the purpose for which such data is collected.
            </p>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              10. Grievance Redressal Mechanism
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">
              In case you have any complaints or grievances pertaining to (i) any User Content that You believe violates these Terms including any infringement of Intellectual Property Rights, (ii) Your access to the Platform, please share the same with Us by writing to: <a href="mailto:myseries11assist@gmail.com" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">myseries11assist@gmail.com</a>.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You agree that regardless of any statute or law to the contrary, any complaints or grievances arising out of or related to the use of Our Platform or these Terms should be filed within thirty (30) days of such claim to enable us to resolve Your complaint at the earliest.
            </p>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              11. Legality
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">
              Fantasy Sports offered by Us on our platform is a game of skill and a legally and constitutionally protected business not amounting to betting, gambling and wagering held by the Supreme Court of India and different High Courts of India in multiple judgments.
            </p>
            <p className="text-gray-600 leading-relaxed">
              These Contests require You to use Your knowledge, judgement and expertise to primarily determine Your success in such Contests rather than relying on chance.
            </p>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              12. Limitation of Liability and Indemnification
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">
              By accessing Our Platform, You hereby agree to indemnify Us and/or any of Our directors, employees, partners, affiliates, associates and licensors against all liability, cost, loss, claims or expense arising out of Your access to Our Platform.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Neither We nor Our partners, affiliates, licensors or associates shall be liable for any direct, indirect, incidental, special, or consequential damages arising out of Your use of or inability to use Our Services.
            </p>
          </section>

          <section className="mb-12 lg:mb-16 p-6 lg:p-8 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500 inline-block">
              13. Governing Law and Dispute Resolution
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg mb-4 lg:mb-6">
              The courts of Mumbai shall have exclusive jurisdiction to determine any and all disputes related to Our Services and any Dispute will be governed by the laws of the Republic of India.
            </p>
            <p className="text-gray-600 leading-relaxed">
              If there is a legal Dispute, the party raising the Dispute must send a written notification to the other party. The parties will then try to resolve the Dispute through amicable discussions.
            </p>
          </section>

          <section className="mb-8 p-6 hover:bg-gray-50 transition-colors duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500 inline-block">
              14. Disclaimers
            </h2>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2 ml-4">
              <li>We will not be liable for any delay or failure to render the Services resulting from any Force Majeure Event</li>
              <li>You may access Our Platform at Your own risk</li>
              <li>We do not provide any warranty for Our Content, which is provided on an "as is, as available basis"</li>
              <li>We are not responsible for any errors or inaccuracies in the team starting line-up data provided on Our Platform</li>
              <li>We will not be liable for your inability to access Our Platform for any reason beyond our control</li>
            </ul>
          </section>

          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-lg text-center">
            <p className="text-sm mb-4 opacity-80">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="text-base">
              For any queries, please contact us at <a href="mailto:myseries11assist@gmail.com" className="text-blue-300 hover:text-white font-medium transition-colors">myseries11assist@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms