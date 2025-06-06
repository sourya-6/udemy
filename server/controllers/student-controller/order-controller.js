


const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    // Ensure coursePricing is properly formatted
    const formattedPrice = parseFloat(coursePricing).toFixed(2);

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/payment-return`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: courseId,
                price: formattedPrice,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: formattedPrice,
          },
          description: `Payment for course: ${courseTitle}`,
        },
      ],
    };

    // Create PayPal Payment
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("❌ PayPal Payment Error:", error.response || error);
        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment!",
          error: error.response || error.message || error, // Return full error response
        });
      } else {
        const approveUrl = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        )?.href;

        if (!approveUrl) {
          console.error("❌ PayPal response missing approval URL!");
          return res.status(500).json({
            success: false,
            message: "No approval URL received from PayPal!",
          });
        }

        // Create Order in Database
        const order = new Order({
          userId,
          userName,
          userEmail,
          orderStatus: "pending",
          paymentMethod: "PayPal",
          paymentStatus: "unpaid",
          orderDate,
          instructorId,
          instructorName,
          courseImage,
          courseTitle,
          courseId,
          coursePricing: formattedPrice,
        });

        await order.save();

        // Send response with approveUrl and orderId
        res.status(201).json({
          success: true,
          data: {
            approveUrl,
            paymentId: paymentInfo.id,
            orderId: order._id,  // Include orderId for better tracking
          },
        });
      }
    });
  } catch (err) {
    console.error("❌ Internal Server Error:", err);
    res.status(500).json({
      success: false,
      message: "Some error occurred while creating the order!",
    });
  }
};




const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update the order status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    await order.save();

    // Update the StudentCourses model
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    if (studentCourses) {
      studentCourses.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });

      await studentCourses.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });

      await newStudentCourses.save();
    }

    // Update the Course schema to add the student
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed and payment processed",
      data: order,
    });
  } catch (err) {
    console.error("❌ Internal Server Error:", err);
    res.status(500).json({
      success: false,
      message: "Some error occurred while capturing payment!",
    });
  }
};




module.exports = { createOrder, capturePaymentAndFinalizeOrder };
